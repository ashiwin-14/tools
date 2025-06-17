document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Get thumbnails button
    document.getElementById('get-thumbnails').addEventListener('click', getThumbnails);
    
    // Clear URL button
    document.getElementById('clear-url').addEventListener('click', clearURL);
    
    // Download all button
    document.getElementById('download-all').addEventListener('click', downloadAllThumbnails);
    
    // Copy all links button
    document.getElementById('copy-all-links').addEventListener('click', copyAllLinks);
    
    // Enter key support
    document.getElementById('youtube-url').addEventListener('keypress', function(e) {
        
        if (e.key === 'Enter') {
            getThumbnails();
        }
    });
}

function getThumbnails() {
    const urlInput = document.getElementById('youtube-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Please enter a YouTube URL', 'warning');
        return;
    }
    
    const videoId = extractVideoId(url);
    if (!videoId) {
        showNotification('Invalid YouTube URL. Please check the format.', 'error');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Update video info
    updateVideoInfo(videoId, url);
    
    // Generate thumbnails
    setTimeout(() => {
        generateThumbnails(videoId);
        showNotification('Thumbnails loaded successfully!', 'success');
    }, 1000); // Simulate loading time
}

function extractVideoId(url) {
    // Regular expressions for different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

function updateVideoInfo(videoId, url) {
    document.getElementById('video-id').textContent = videoId;
    
    let format = 'Unknown';
    if (url.includes('youtube.com/watch')) {
        format = 'Standard YouTube URL';
    } else if (url.includes('youtu.be/')) {
        format = 'Shortened YouTube URL';
    } else if (url.includes('youtube.com/embed/')) {
        format = 'Embedded YouTube URL';
    }
    
    document.getElementById('url-format').textContent = format;
    document.getElementById('video-info').style.display = 'block';
}

function showLoading() {
    const output = document.getElementById('thumbnails-output');
    output.innerHTML = '<div class="loading">Loading thumbnails...</div>';
}

function generateThumbnails(videoId) {
    const thumbnailSizes = [
        {
            name: 'Default',
            key: 'default',
            url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
            dimensions: '120×90',
            description: 'Basic thumbnail quality'
        },
        {
            name: 'Medium Quality',
            key: 'mqdefault',
            url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            dimensions: '320×180',
            description: 'Good for web use'
        },
        {
            name: 'High Quality',
            key: 'hqdefault',
            url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            dimensions: '480×360',
            description: 'High resolution thumbnail'
        },
        {
            name: 'Standard Definition',
            key: 'sddefault',
            url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            dimensions: '640×480',
            description: 'Standard quality'
        },
        {
            name: 'Max Resolution',
            key: 'maxresdefault',
            url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            dimensions: '1280×720',
            description: 'Highest quality available'
        }
    ];
    
    const output = document.getElementById('thumbnails-output');
    let html = '<div class="thumbnails-grid">';
    
    thumbnailSizes.forEach(thumbnail => {
        html += `
            <div class="thumbnail-item">
                <img src="${thumbnail.url}" 
                     alt="${thumbnail.name} thumbnail" 
                     class="thumbnail-image"
                     onclick="downloadThumbnail('${thumbnail.url}', '${videoId}_${thumbnail.key}.jpg')"
                     onerror="this.parentElement.style.display='none'">
                <div class="thumbnail-info">
                    <div class="thumbnail-title">${thumbnail.name}</div>
                    <div class="thumbnail-details">${thumbnail.dimensions} • ${thumbnail.description}</div>
                    <div class="thumbnail-actions">
                        <button class="btn btn-primary btn-small" 
                                onclick="downloadThumbnail('${thumbnail.url}', '${videoId}_${thumbnail.key}.jpg')">
                            Download
                        </button>
                        <button class="btn btn-secondary btn-small" 
                                onclick="copyThumbnailLink('${thumbnail.url}')">
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    output.innerHTML = html;
    
    // Show bulk actions
    document.getElementById('bulk-actions').style.display = 'flex';
    
    // Store thumbnails for bulk operations
    window.currentThumbnails = thumbnailSizes.map(t => ({
        url: t.url,
        filename: `${videoId}_${t.key}.jpg`
    }));
}

function downloadThumbnail(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.click();
    
    showNotification(`Downloading ${filename}`, 'success');
}

function copyThumbnailLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Thumbnail link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

function downloadAllThumbnails() {
    if (!window.currentThumbnails) {
        showNotification('No thumbnails available', 'warning');
        return;
    }
    
    window.currentThumbnails.forEach((thumbnail, index) => {
        setTimeout(() => {
            downloadThumbnail(thumbnail.url, thumbnail.filename);
        }, index * 500); // Stagger downloads
    });
    
    showNotification(`Downloading ${window.currentThumbnails.length} thumbnails...`, 'success');
}

function copyAllLinks() {
    if (!window.currentThumbnails) {
        showNotification('No thumbnails available', 'warning');
        return;
    }
    
    const links = window.currentThumbnails.map(t => t.url).join('\n');
    
    navigator.clipboard.writeText(links).then(() => {
        showNotification('All thumbnail links copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy links', 'error');
    });
}

function clearURL() {
    document.getElementById('youtube-url').value = '';
    document.getElementById('video-info').style.display = 'none';
    document.getElementById('bulk-actions').style.display = 'none';
    
    // Reset output
    document.getElementById('thumbnails-output').innerHTML = `
        <div class="thumbnails-placeholder">
            <div class="placeholder-icon">🎬</div>
            <p>Enter a YouTube URL to see available thumbnails</p>
            <p class="placeholder-hint">Thumbnails will be displayed here in different resolutions</p>
        </div>
    `;
    
    window.currentThumbnails = null;
    showNotification('Cleared', 'info');
}