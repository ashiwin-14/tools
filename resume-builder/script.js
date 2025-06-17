document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updatePreview();
});

function setupEventListeners() {
    // Form input listeners
    const form = document.getElementById('resume-form');
    form.addEventListener('input', updatePreview);
    
    // Add experience button
    document.getElementById('add-experience-btn').addEventListener('click', addExperienceItem);
    
    // Add education button
    document.getElementById('add-education-btn').addEventListener('click', addEducationItem);
    
    // Print button
    document.getElementById('print-resume').addEventListener('click', function() {
        window.print();
    });
    
    // Download PDF button
    document.getElementById('download-resume').addEventListener('click', function() {
        showNotification('PDF download feature would require a PDF library in a real implementation', 'info');
    });
}

function addExperienceItem() {
    const container = document.getElementById('experience-items');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" name="jobTitle" placeholder="Software Developer">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" name="company" placeholder="Tech Company Inc.">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" name="startDate">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" name="endDate" placeholder="Leave empty if current">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" placeholder="Key responsibilities and achievements..."></textarea>
        </div>
        <button type="button" class="remove-item-btn" onclick="removeExperienceItem(this)">Remove</button>
    `;
    container.appendChild(newItem);
    
    // Add event listeners to new inputs
    const inputs = newItem.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeExperienceItem(button) {
    const item = button.closest('.experience-item');
    item.remove();
    updatePreview();
}

function addEducationItem() {
    const container = document.getElementById('education-items');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <div class="form-group">
            <label>Degree</label>
            <input type="text" name="degree" placeholder="Bachelor of Science in Computer Science">
        </div>
        <div class="form-group">
            <label>School</label>
            <input type="text" name="school" placeholder="University of Technology">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Year</label>
                <input type="number" name="startYear" placeholder="2018" min="1950" max="2030">
            </div>
            <div class="form-group">
                <label>End Year</label>
                <input type="number" name="endYear" placeholder="2022" min="1950" max="2030">
            </div>
        </div>
        <button type="button" class="remove-item-btn" onclick="removeEducationItem(this)">Remove</button>
    `;
    container.appendChild(newItem);
    
    // Add event listeners to new inputs
    const inputs = newItem.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeEducationItem(button) {
    const item = button.closest('.education-item');
    item.remove();
    updatePreview();
}

function updatePreview() {
    updatePersonalInfo();
    updateSummary();
    updateSkills();
    updateExperience();
    updateEducation();
}

function updatePersonalInfo() {
    const fullName = document.getElementById('full-name').value || 'Your Name';
    const email = document.getElementById('email').value || 'email@example.com';
    const phone = document.getElementById('phone').value || '+1 (555) 123-4567';
    const location = document.getElementById('location').value || 'Location';
    const website = document.getElementById('website').value || 'website';
    
    document.getElementById('preview-name').textContent = fullName;
    document.getElementById('preview-email').textContent = email;
    document.getElementById('preview-phone').textContent = phone;
    document.getElementById('preview-location').textContent = location;
    document.getElementById('preview-website').textContent = website;
}

function updateSummary() {
    const summary = document.getElementById('summary').value || 'Your professional summary will appear here...';
    document.getElementById('preview-summary').textContent = summary;
    
    const summarySection = document.getElementById('summary-section');
    summarySection.style.display = document.getElementById('summary').value ? 'block' : 'none';
}

function updateSkills() {
    const skillsInput = document.getElementById('skills').value;
    const skillsContainer = document.getElementById('preview-skills');
    
    if (!skillsInput.trim()) {
        skillsContainer.innerHTML = '<span class="skill-tag">Your skills will appear here</span>';
        return;
    }
    
    const skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);
    const skillsHTML = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    skillsContainer.innerHTML = skillsHTML;
}

function updateExperience() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const previewContainer = document.getElementById('preview-experience');
    
    if (experienceItems.length === 0) {
        previewContainer.innerHTML = '<div class="experience-preview"><p class="no-content">Add work experience to see it here</p></div>';
        return;
    }
    
    let html = '';
    let hasContent = false;
    
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('input[name="jobTitle"]').value;
        const company = item.querySelector('input[name="company"]').value;
        const startDate = item.querySelector('input[name="startDate"]').value;
        const endDate = item.querySelector('input[name="endDate"]').value;
        const description = item.querySelector('textarea[name="description"]').value;
        
        if (jobTitle || company) {
            hasContent = true;
            const startDateFormatted = startDate ? formatMonthYear(startDate) : '';
            const endDateFormatted = endDate ? formatMonthYear(endDate) : 'Present';
            const dateRange = startDateFormatted ? `${startDateFormatted} - ${endDateFormatted}` : '';
            
            html += `
                <div class="experience-preview">
                    <div class="job-header">
                        <div>
                            <div class="job-title">${jobTitle || 'Job Title'}</div>
                            <div class="company">${company || 'Company'}</div>
                        </div>
                        <div class="job-dates">${dateRange}</div>
                    </div>
                    ${description ? `<div class="job-description">${description}</div>` : ''}
                </div>
            `;
        }
    });
    
    if (!hasContent) {
        html = '<div class="experience-preview"><p class="no-content">Add work experience to see it here</p></div>';
    }
    
    previewContainer.innerHTML = html;
}

function updateEducation() {
    const educationItems = document.querySelectorAll('.education-item');
    const previewContainer = document.getElementById('preview-education');
    
    if (educationItems.length === 0) {
        previewContainer.innerHTML = '<div class="education-preview"><p class="no-content">Add education to see it here</p></div>';
        return;
    }
    
    let html = '';
    let hasContent = false;
    
    educationItems.forEach(item => {
        const degree = item.querySelector('input[name="degree"]').value;
        const school = item.querySelector('input[name="school"]').value;
        const startYear = item.querySelector('input[name="startYear"]').value;
        const endYear = item.querySelector('input[name="endYear"]').value;
        
        if (degree || school) {
            hasContent = true;
            const yearRange = startYear && endYear ? `${startYear} - ${endYear}` : 
                            startYear ? `${startYear} - Present` : '';
            
            html += `
                <div class="education-preview">
                    <div class="education-header">
                        <div>
                            <div class="degree-title">${degree || 'Degree'}</div>
                            <div class="school">${school || 'School'}</div>
                        </div>
                        <div class="education-dates">${yearRange}</div>
                    </div>
                </div>
            `;
        }
    });
    
    if (!hasContent) {
        html = '<div class="education-preview"><p class="no-content">Add education to see it here</p></div>';
    }
    
    previewContainer.innerHTML = html;
}

function formatMonthYear(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}