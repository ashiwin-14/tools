document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    // Set due date to 30 days from today
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('due-date').value = dueDate.toISOString().split('T')[0];
    
    // Add event listeners
    setupEventListeners();
    
    // Initial calculation
    calculateTotals();
    updatePreview();
});

function setupEventListeners() {
    // Form input listeners
    const form = document.getElementById('invoice-form');
    form.addEventListener('input', function(e) {
        if (e.target.name === 'hours' || e.target.name === 'rate') {
            updateItemTotal(e.target);
        }
        calculateTotals();
        updatePreview();
    });
    
    // Tax rate listener
    document.getElementById('tax-rate').addEventListener('input', function() {
        calculateTotals();
        updatePreview();
    });
    
    // Add item button
    document.getElementById('add-item-btn').addEventListener('click', addInvoiceItem);
    
    // Print button
    document.getElementById('print-invoice').addEventListener('click', function() {
        window.print();
    });
    
    // Download PDF button
    document.getElementById('download-pdf').addEventListener('click', function() {
        showNotification('PDF download feature would require a PDF library in a real implementation', 'info');
    });
}

function addInvoiceItem() {
    const itemsContainer = document.getElementById('invoice-items');
    const newItem = document.createElement('div');
    newItem.className = 'invoice-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="description" placeholder="Service description" required>
            </div>
            <div class="form-group">
                <label>Hours/Qty</label>
                <input type="number" name="hours" placeholder="0" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Rate ($)</label>
                <input type="number" name="rate" placeholder="0.00" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Total</label>
                <input type="text" name="total" readonly class="readonly">
            </div>
            <button type="button" class="remove-item-btn" onclick="removeInvoiceItem(this)">×</button>
        </div>
    `;
    itemsContainer.appendChild(newItem);
    
    // Add event listeners to new inputs
    const newInputs = newItem.querySelectorAll('input[name="hours"], input[name="rate"]');
    newInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateItemTotal(this);
            calculateTotals();
            updatePreview();
        });
    });
    
    const descInput = newItem.querySelector('input[name="description"]');
    descInput.addEventListener('input', function() {
        updatePreview();
    });
}

function removeInvoiceItem(button) {
    const item = button.closest('.invoice-item');
    item.remove();
    calculateTotals();
    updatePreview();
}

function updateItemTotal(input) {
    const item = input.closest('.invoice-item');
    const hoursInput = item.querySelector('input[name="hours"]');
    const rateInput = item.querySelector('input[name="rate"]');
    const totalInput = item.querySelector('input[name="total"]');
    
    const hours = parseFloat(hoursInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const total = hours * rate;
    
    totalInput.value = `$${total.toFixed(2)}`;
}

function calculateTotals() {
    const items = document.querySelectorAll('.invoice-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const hoursInput = item.querySelector('input[name="hours"]');
        const rateInput = item.querySelector('input[name="rate"]');
        
        const hours = parseFloat(hoursInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        subtotal += hours * rate;
    });
    
    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    // Update display
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax-amount').textContent = `$${taxAmount.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

function updatePreview() {
    // Update basic info
    document.getElementById('preview-invoice-number').textContent = 
        document.getElementById('invoice-number').value || 'INV-001';
    
    document.getElementById('preview-invoice-date').textContent = 
        formatDate(document.getElementById('invoice-date').value);
    
    document.getElementById('preview-due-date').textContent = 
        formatDate(document.getElementById('due-date').value);
    
    document.getElementById('preview-your-name').textContent = 
        document.getElementById('your-name').value || 'Your Business';
    
    document.getElementById('preview-your-address').innerHTML = 
        (document.getElementById('your-address').value || 'Your Address').replace(/\n/g, '<br>');
    
    document.getElementById('preview-client-name').textContent = 
        document.getElementById('client-name').value || 'Client Name';
    
    // Update items table
    updatePreviewItems();
    
    // Update totals
    const subtotal = document.getElementById('subtotal').textContent;
    const taxAmount = document.getElementById('tax-amount').textContent;
    const total = document.getElementById('total-amount').textContent;
    
    document.getElementById('preview-subtotal').textContent = subtotal;
    document.getElementById('preview-tax').textContent = taxAmount;
    document.getElementById('preview-total').textContent = total;
}

function updatePreviewItems() {
    const items = document.querySelectorAll('.invoice-item');
    const previewItems = document.getElementById('preview-items');
    
    if (items.length === 0) {
        previewItems.innerHTML = '<tr><td colspan="4" class="no-items">No items added</td></tr>';
        return;
    }
    
    let html = '';
    items.forEach(item => {
        const description = item.querySelector('input[name="description"]').value || '-';
        const hours = item.querySelector('input[name="hours"]').value || '0';
        const rate = item.querySelector('input[name="rate"]').value || '0.00';
        const total = parseFloat(hours) * parseFloat(rate);
        
        html += `
            <tr>
                <td>${description}</td>
                <td>${hours}</td>
                <td>$${parseFloat(rate).toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    previewItems.innerHTML = html;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}