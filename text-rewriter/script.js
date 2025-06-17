document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateTextStats();
});

function setupEventListeners() {
    // Text input listener for stats
    document.getElementById('input-text').addEventListener('input', updateTextStats);
    
    // Action buttons
    document.getElementById('rewrite-text').addEventListener('click', rewriteText);
    document.getElementById('summarize-text').addEventListener('click', summarizeText);
    document.getElementById('clear-text').addEventListener('click', clearAll);
    
    // Output actions
    document.getElementById('copy-output').addEventListener('click', copyOutput);
    document.getElementById('download-output').addEventListener('click', downloadOutput);
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
}

function updateTextStats() {
    const text = document.getElementById('input-text').value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    
    document.getElementById('char-count').textContent = `${charCount} characters`;
    document.getElementById('word-count').textContent = `${wordCount} words`;
    document.getElementById('sentence-count').textContent = `${sentenceCount} sentences`;
}

function rewriteText() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showNotification('Please enter some text to rewrite', 'warning');
        return;
    }
    
    const style = document.querySelector('input[name="rewriteStyle"]:checked').value;
    
    // Show processing state
    const output = document.getElementById('rewritten-output');
    output.classList.add('processing');
    output.innerHTML = '<div class="output-placeholder"><div class="placeholder-icon">⏳</div><p>Rewriting text...</p></div>';
    
    // Simulate processing time
    setTimeout(() => {
        const rewrittenText = performRewrite(inputText, style);
        displayRewrittenText(rewrittenText);
        switchTab('rewritten');
        showNotification('Text rewritten successfully!', 'success');
    }, 2000);
}

function summarizeText() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showNotification('Please enter some text to summarize', 'warning');
        return;
    }
    
    const length = document.querySelector('input[name="summaryLength"]:checked').value;
    
    // Show processing state
    const output = document.getElementById('summary-output');
    output.classList.add('processing');
    output.innerHTML = '<div class="output-placeholder"><div class="placeholder-icon">⏳</div><p>Creating summary...</p></div>';
    
    // Simulate processing time
    setTimeout(() => {
        const summary = performSummarization(inputText, length);
        displaySummary(summary);
        switchTab('summary');
        showNotification('Summary created successfully!', 'success');
    }, 1500);
}

function performRewrite(text, style) {
    // Simple rewriting using synonym replacement and sentence restructuring
    const synonyms = {
        'good': ['excellent', 'great', 'fine', 'wonderful', 'outstanding'],
        'bad': ['poor', 'terrible', 'awful', 'horrible', 'dreadful'],
        'big': ['large', 'huge', 'enormous', 'massive', 'gigantic'],
        'small': ['tiny', 'little', 'miniature', 'compact', 'petite'],
        'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty'],
        'slow': ['sluggish', 'gradual', 'leisurely', 'unhurried', 'delayed'],
        'important': ['significant', 'crucial', 'vital', 'essential', 'critical'],
        'easy': ['simple', 'effortless', 'straightforward', 'uncomplicated', 'basic'],
        'hard': ['difficult', 'challenging', 'tough', 'demanding', 'complex'],
        'nice': ['pleasant', 'lovely', 'delightful', 'charming', 'agreeable'],
        'very': ['extremely', 'highly', 'remarkably', 'exceptionally', 'particularly'],
        'really': ['truly', 'genuinely', 'actually', 'indeed', 'certainly'],
        'many': ['numerous', 'several', 'various', 'multiple', 'countless'],
        'help': ['assist', 'aid', 'support', 'facilitate', 'contribute'],
        'make': ['create', 'produce', 'generate', 'construct', 'build'],
        'use': ['utilize', 'employ', 'apply', 'implement', 'operate'],
        'get': ['obtain', 'acquire', 'receive', 'gain', 'secure'],
        'show': ['display', 'demonstrate', 'reveal', 'exhibit', 'present'],
        'think': ['believe', 'consider', 'suppose', 'assume', 'contemplate']
    };
    
    let rewritten = text;
    
    // Replace synonyms
    Object.keys(synonyms).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        rewritten = rewritten.replace(regex, (match) => {
            const replacements = synonyms[word.toLowerCase()];
            const replacement = replacements[Math.floor(Math.random() * replacements.length)];
            return match === match.toLowerCase() ? replacement : 
                   match === match.toUpperCase() ? replacement.toUpperCase() :
                   replacement.charAt(0).toUpperCase() + replacement.slice(1);
        });
    });
    
    // Apply style modifications
    if (style === 'formal') {
        rewritten = makeFormal(rewritten);
    } else if (style === 'casual') {
        rewritten = makeCasual(rewritten);
    }
    
    return rewritten;
}

function makeFormal(text) {
    // Convert contractions to full forms
    const contractions = {
        "don't": "do not",
        "won't": "will not",
        "can't": "cannot",
        "isn't": "is not",
        "aren't": "are not",
        "wasn't": "was not",
        "weren't": "were not",
        "haven't": "have not",
        "hasn't": "has not",
        "hadn't": "had not",
        "wouldn't": "would not",
        "shouldn't": "should not",
        "couldn't": "could not",
        "mustn't": "must not",
        "needn't": "need not",
        "daren't": "dare not",
        "mayn't": "may not",
        "oughtn't": "ought not",
        "mightn't": "might not"
    };
    
    let formal = text;
    Object.keys(contractions).forEach(contraction => {
        const regex = new RegExp(contraction, 'gi');
        formal = formal.replace(regex, contractions[contraction]);
    });
    
    return formal;
}

function makeCasual(text) {
    // Add casual expressions and contractions
    let casual = text;
    
    // Convert some formal phrases to casual
    casual = casual.replace(/\bhowever\b/gi, 'but');
    casual = casual.replace(/\btherefore\b/gi, 'so');
    casual = casual.replace(/\bfurthermore\b/gi, 'also');
    casual = casual.replace(/\bin addition\b/gi, 'plus');
    
    return casual;
}

function performSummarization(text, length) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length === 0) return text;
    
    let targetSentences;
    switch (length) {
        case 'short':
            targetSentences = Math.min(2, sentences.length);
            break;
        case 'medium':
            targetSentences = Math.min(4, Math.ceil(sentences.length * 0.4));
            break;
        case 'long':
            targetSentences = Math.min(6, Math.ceil(sentences.length * 0.6));
            break;
        default:
            targetSentences = Math.min(2, sentences.length);
    }
    
    // Simple extractive summarization - select sentences based on position and length
    const selectedSentences = [];
    
    // Always include the first sentence if available
    if (sentences.length > 0) {
        selectedSentences.push(sentences[0].trim());
    }
    
    // Add middle sentences based on length
    if (targetSentences > 1 && sentences.length > 2) {
        const step = Math.floor(sentences.length / targetSentences);
        for (let i = step; i < sentences.length - 1 && selectedSentences.length < targetSentences - 1; i += step) {
            if (!selectedSentences.includes(sentences[i].trim())) {
                selectedSentences.push(sentences[i].trim());
            }
        }
    }
    
    // Add the last sentence if we need more and it's different from the first
    if (selectedSentences.length < targetSentences && sentences.length > 1) {
        const lastSentence = sentences[sentences.length - 1].trim();
        if (!selectedSentences.includes(lastSentence)) {
            selectedSentences.push(lastSentence);
        }
    }
    
    return selectedSentences.join('. ') + '.';
}

function displayRewrittenText(text) {
    const output = document.getElementById('rewritten-output');
    output.classList.remove('processing');
    output.innerHTML = `<p>${text}</p>`;
    
    // Update stats
    updateOutputStats(text, 'rewritten');
    document.getElementById('rewritten-stats').style.display = 'flex';
    document.getElementById('output-actions').style.display = 'flex';
    
    // Update comparison
    updateComparison();
    
    window.currentOutput = text;
    window.currentOutputType = 'rewritten';
}

function displaySummary(text) {
    const output = document.getElementById('summary-output');
    output.classList.remove('processing');
    output.innerHTML = `<p>${text}</p>`;
    
    // Update stats
    updateOutputStats(text, 'summary');
    document.getElementById('summary-stats').style.display = 'flex';
    document.getElementById('output-actions').style.display = 'flex';
    
    // Update comparison
    updateComparison();
    
    window.currentOutput = text;
    window.currentOutputType = 'summary';
}

function updateOutputStats(text, type) {
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    document.getElementById(`${type}-char-count`).textContent = `${charCount} characters`;
    document.getElementById(`${type}-word-count`).textContent = `${wordCount} words`;
}

function updateComparison() {
    const originalText = document.getElementById('input-text').value.trim();
    const processedText = window.currentOutput || '';
    
    document.getElementById('original-preview').innerHTML = 
        originalText ? `<p>${originalText.substring(0, 300)}${originalText.length > 300 ? '...' : ''}</p>` : 
        '<p class="no-content">No original text</p>';
    
    document.getElementById('processed-preview').innerHTML = 
        processedText ? `<p>${processedText.substring(0, 300)}${processedText.length > 300 ? '...' : ''}</p>` : 
        '<p class="no-content">No processed text</p>';
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function copyOutput() {
    if (!window.currentOutput) {
        showNotification('No text to copy', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(window.currentOutput).then(() => {
        showNotification('Text copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy text', 'error');
    });
}

function downloadOutput() {
    if (!window.currentOutput) {
        showNotification('No text to download', 'warning');
        return;
    }
    
    const blob = new Blob([window.currentOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${window.currentOutputType || 'processed'}_text.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Text downloaded successfully!', 'success');
}

function clearAll() {
    // Clear input
    document.getElementById('input-text').value = '';
    updateTextStats();
    
    // Clear outputs
    document.getElementById('rewritten-output').innerHTML = `
        <div class="output-placeholder">
            <div class="placeholder-icon">✏️</div>
            <p>Rewritten text will appear here</p>
            <p class="placeholder-hint">Click "Rewrite Text" to process your content</p>
        </div>
    `;
    
    document.getElementById('summary-output').innerHTML = `
        <div class="output-placeholder">
            <div class="placeholder-icon">📝</div>
            <p>Summary will appear here</p>
            <p class="placeholder-hint">Click "Summarize Text" to create a summary</p>
        </div>
    `;
    
    // Hide stats and actions
    document.getElementById('rewritten-stats').style.display = 'none';
    document.getElementById('summary-stats').style.display = 'none';
    document.getElementById('output-actions').style.display = 'none';
    
    // Reset comparison
    updateComparison();
    
    // Reset to first tab
    switchTab('rewritten');
    
    // Clear stored output
    window.currentOutput = null;
    window.currentOutputType = null;
    
    showNotification('All content cleared', 'info');
}