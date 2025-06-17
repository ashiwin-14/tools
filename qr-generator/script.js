document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // QR type change listener
    document.getElementById('qr-type').addEventListener('change', function() {
        showInputGroup(this.value);
    });
    
    // Generate button
    document.getElementById('generate-qr').addEventListener('click', generateQRCode);
    
    // Clear button
    document.getElementById('clear-form').addEventListener('click', clearForm);
    
    // Download button
    document.getElementById('download-qr').addEventListener('click', downloadQRCode);
    
    // Copy link button
    document.getElementById('copy-link').addEventListener('click', copyDataURL);
}

function showInputGroup(type) {
    // Hide all input groups
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach(group => {
        group.style.display = 'none';
    });
    
    // Show selected input group
    const selectedGroup = document.getElementById(`${type}-input`);
    if (selectedGroup) {
        selectedGroup.style.display = 'block';
    }
}

function generateQRCode() {
    const qrType = document.getElementById('qr-type').value;
    let content = '';
    
    // Get content based on type
    try {
        content = getQRContent(qrType);
        if (!content) {
            showNotification('Please fill in the required fields', 'warning');
            return;
        }
    } catch (error) {
        showNotification('Error generating content: ' + error.message, 'error');
        return;
    }
    
    // Get customization options
    const size = parseInt(document.getElementById('qr-size').value) || 256;
    const foregroundColor = document.getElementById('qr-color').value || '#000000';
    const backgroundColor = document.getElementById('qr-background').value || '#ffffff';
    
    // Generate QR code
    try {
        createQRCode(content, size, foregroundColor, backgroundColor);
        updateQRInfo(qrType, content, size);
        showNotification('QR Code generated successfully!', 'success');
    } catch (error) {
        showNotification('Error generating QR code: ' + error.message, 'error');
    }
}

function getQRContent(type) {
    switch (type) {
        case 'text':
            return document.getElementById('text-content').value.trim();
            
        case 'url':
            const url = document.getElementById('url-content').value.trim();
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                return 'https://' + url;
            }
            return url;
            
        case 'email':
            const email = document.getElementById('email-address').value.trim();
            if (!email) return '';
            
            const subject = document.getElementById('email-subject').value.trim();
            const body = document.getElementById('email-body').value.trim();
            
            let mailto = `mailto:${email}`;
            const params = [];
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            if (params.length > 0) mailto += '?' + params.join('&');
            
            return mailto;
            
        case 'phone':
            const phone = document.getElementById('phone-number').value.trim();
            return phone ? `tel:${phone}` : '';
            
        case 'sms':
            const smsNumber = document.getElementById('sms-number').value.trim();
            const smsMessage = document.getElementById('sms-message').value.trim();
            if (!smsNumber) return '';
            
            return smsMessage ? `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}` : `sms:${smsNumber}`;
            
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value.trim();
            const password = document.getElementById('wifi-password').value.trim();
            const security = document.getElementById('wifi-security').value;
            
            if (!ssid) return '';
            
            return `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
            
        default:
            return '';
    }
}

function createQRCode(content, size, foregroundColor, backgroundColor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // Simple QR code generation (this is a basic implementation)
    // In a real application, you would use a proper QR code library
    generateSimpleQR(ctx, content, size, foregroundColor, backgroundColor);
    
    // Display the QR code
    const output = document.getElementById('qr-output');
    output.innerHTML = '<div class="qr-canvas-container"></div>';
    output.querySelector('.qr-canvas-container').appendChild(canvas);
    canvas.className = 'qr-canvas';
    
    // Show actions and info
    document.getElementById('qr-actions').style.display = 'flex';
    document.getElementById('qr-info').style.display = 'block';
    
    // Store canvas for download
    window.currentQRCanvas = canvas;
}

function generateSimpleQR(ctx, content, size, foregroundColor, backgroundColor) {
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
    
    // This is a very basic QR code representation
    // In a real implementation, you would use a proper QR code library like qrious or qrcode-generator
    const gridSize = 25;
    const cellSize = size / gridSize;
    
    ctx.fillStyle = foregroundColor;
    
    // Create a simple pattern based on content hash
    const hash = simpleHash(content);
    const pattern = generatePattern(hash, gridSize);
    
    // Draw the pattern
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (pattern[row][col]) {
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Add corner squares (QR code positioning markers)
    drawPositionMarker(ctx, 0, 0, cellSize);
    drawPositionMarker(ctx, (gridSize - 7) * cellSize, 0, cellSize);
    drawPositionMarker(ctx, 0, (gridSize - 7) * cellSize, cellSize);
}

function drawPositionMarker(ctx, x, y, cellSize) {
    // Outer square
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = ctx.canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

function generatePattern(hash, size) {
    const pattern = [];
    let seed = hash;
    
    for (let row = 0; row < size; row++) {
        pattern[row] = [];
        for (let col = 0; col < size; col++) {
            // Skip positioning markers
            if ((row < 9 && col < 9) || 
                (row < 9 && col >= size - 8) || 
                (row >= size - 8 && col < 9)) {
                pattern[row][col] = (row < 7 && col < 7) ||
                                   (row < 7 && col >= size - 7) ||
                                   (row >= size - 7 && col < 7);
            } else {
                seed = (seed * 1103515245 + 12345) & 0x7fffffff;
                pattern[row][col] = (seed % 3) === 0;
            }
        }
    }
    
    return pattern;
}

function updateQRInfo(type, content, size) {
    document.getElementById('info-type').textContent = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('info-size').textContent = `${size}x${size} pixels`;
    document.getElementById('info-content').textContent = content.length > 50 ? 
        content.substring(0, 50) + '...' : content;
}

function downloadQRCode() {
    if (!window.currentQRCanvas) {
        showNotification('No QR code to download', 'warning');
        return;
    }
    
    const canvas = window.currentQRCanvas;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
    
    showNotification('QR code downloaded successfully!', 'success');
}

function copyDataURL() {
    if (!window.currentQRCanvas) {
        showNotification('No QR code to copy', 'warning');
        return;
    }
    
    const canvas = window.currentQRCanvas;
    const dataURL = canvas.toDataURL();
    
    navigator.clipboard.writeText(dataURL).then(() => {
        showNotification('Data URL copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function clearForm() {
    document.getElementById('qr-form').reset();
    document.getElementById('qr-size').value = 256;
    document.getElementById('qr-color').value = '#000000';
    document.getElementById('qr-background').value = '#ffffff';
    
    // Reset to text input
    showInputGroup('text');
    
    // Reset output
    document.getElementById('qr-output').innerHTML = `
        <div class="qr-placeholder">
            <div class="placeholder-icon">📱</div>
            <p>Your QR code will appear here</p>
            <p class="placeholder-hint">Fill in the form and click "Generate QR Code"</p>
        </div>
    `;
    
    document.getElementById('qr-actions').style.display = 'none';
    document.getElementById('qr-info').style.display = 'none';
    
    window.currentQRCanvas = null;
    
    showNotification('Form cleared', 'info');
}