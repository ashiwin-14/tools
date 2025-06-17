document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Generate policy button
    document.getElementById('generate-policy').addEventListener('click', generatePrivacyPolicy);
    
    // Clear form button
    document.getElementById('clear-form').addEventListener('click', clearForm);
    
    // Output actions
    document.getElementById('copy-policy').addEventListener('click', copyPolicy);
    document.getElementById('download-policy').addEventListener('click', downloadPolicyHTML);
    document.getElementById('download-txt').addEventListener('click', downloadPolicyTXT);
}

function generatePrivacyPolicy() {
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }
    
    // Show generating state
    showGeneratingState();
    
    // Generate policy after a short delay to show loading
    setTimeout(() => {
        const policy = createPrivacyPolicy(formData);
        displayPolicy(policy);
        updatePolicyInfo(policy);
        showNotification('Privacy policy generated successfully!', 'success');
    }, 2000);
}

function collectFormData() {
    return {
        websiteName: document.getElementById('website-name').value.trim(),
        websiteUrl: document.getElementById('website-url').value.trim(),
        contactEmail: document.getElementById('contact-email').value.trim(),
        companyAddress: document.getElementById('company-address').value.trim(),
        dataTypes: Array.from(document.querySelectorAll('input[name="dataTypes"]:checked')).map(cb => cb.value),
        thirdParty: Array.from(document.querySelectorAll('input[name="thirdParty"]:checked')).map(cb => cb.value),
        compliance: Array.from(document.querySelectorAll('input[name="compliance"]:checked')).map(cb => cb.value)
    };
}

function validateFormData(data) {
    if (!data.websiteName) {
        showNotification('Please enter your website name', 'warning');
        return false;
    }
    
    if (!data.websiteUrl) {
        showNotification('Please enter your website URL', 'warning');
        return false;
    }
    
    if (!data.contactEmail) {
        showNotification('Please enter your contact email', 'warning');
        return false;
    }
    
    return true;
}

function showGeneratingState() {
    const output = document.getElementById('policy-output');
    output.classList.add('generating');
    output.innerHTML = `
        <div class="policy-placeholder">
            <div class="placeholder-icon">⏳</div>
            <p>Generating your privacy policy...</p>
            <p class="placeholder-hint">This may take a few moments</p>
        </div>
    `;
}

function createPrivacyPolicy(data) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let policy = `
        <div class="policy-content">
            <h1>Privacy Policy</h1>
            <div class="effective-date">Effective Date: ${currentDate}</div>
            
            <h2>1. Introduction</h2>
            <p>Welcome to ${data.websiteName} ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ${data.websiteUrl} and use our services.</p>
            
            <p>By accessing or using our website, you agree to the terms of this Privacy Policy. If you do not agree with the practices described in this policy, please do not use our website.</p>
    `;
    
    // Information We Collect section
    policy += `
        <h2>2. Information We Collect</h2>
        <p>We may collect and process the following types of information:</p>
        <ul>
    `;
    
    if (data.dataTypes.includes('personal')) {
        policy += `<li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide when registering, subscribing, or contacting us.</li>`;
    }
    
    if (data.dataTypes.includes('usage')) {
        policy += `<li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and navigation patterns.</li>`;
    }
    
    if (data.dataTypes.includes('cookies')) {
        policy += `<li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your browsing experience and analyze website traffic.</li>`;
    }
    
    if (data.dataTypes.includes('analytics')) {
        policy += `<li><strong>Analytics Data:</strong> We collect data through analytics services to understand website performance and user behavior.</li>`;
    }
    
    if (data.dataTypes.includes('marketing')) {
        policy += `<li><strong>Marketing Data:</strong> Information related to your marketing preferences and communication history.</li>`;
    }
    
    if (data.dataTypes.includes('payment')) {
        policy += `<li><strong>Payment Information:</strong> When you make purchases, we collect payment details necessary to process transactions securely.</li>`;
    }
    
    policy += `</ul>`;
    
    // How We Use Your Information
    policy += `
        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
            <li>To provide, maintain, and improve our services</li>
            <li>To process transactions and send related information</li>
            <li>To communicate with you about our services, updates, and promotional offers</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To analyze usage patterns and optimize website performance</li>
            <li>To comply with legal obligations and protect our rights</li>
            <li>To prevent fraud and ensure website security</li>
        </ul>
    `;
    
    // Third-Party Services
    if (data.thirdParty.length > 0) {
        policy += `
            <h2>4. Third-Party Services</h2>
            <p>We may use third-party services that collect, monitor, and analyze data. These services have their own privacy policies:</p>
            <ul>
        `;
        
        if (data.thirdParty.includes('google-analytics')) {
            policy += `<li><strong>Google Analytics:</strong> We use Google Analytics to analyze website traffic and user behavior. Google's privacy policy can be found at https://policies.google.com/privacy</li>`;
        }
        
        if (data.thirdParty.includes('google-ads')) {
            policy += `<li><strong>Google Ads:</strong> We may use Google Ads for advertising purposes. You can opt-out of personalized ads at https://adssettings.google.com/</li>`;
        }
        
        if (data.thirdParty.includes('facebook-pixel')) {
            policy += `<li><strong>Facebook Pixel:</strong> We use Facebook Pixel to measure advertising effectiveness and create targeted audiences.</li>`;
        }
        
        if (data.thirdParty.includes('mailchimp')) {
            policy += `<li><strong>Email Marketing Services:</strong> We use email marketing platforms to send newsletters and promotional content to subscribers.</li>`;
        }
        
        if (data.thirdParty.includes('stripe')) {
            policy += `<li><strong>Payment Processors:</strong> We use secure payment processors to handle transactions. Payment information is processed according to their privacy policies.</li>`;
        }
        
        if (data.thirdParty.includes('social-media')) {
            policy += `<li><strong>Social Media Integration:</strong> Our website may include social media features that are governed by the respective platforms' privacy policies.</li>`;
        }
        
        policy += `</ul>`;
    }
    
    // Data Security
    policy += `
        <h2>5. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
        <ul>
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication procedures</li>
            <li>Employee training on data protection practices</li>
        </ul>
        <p>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
    `;
    
    // Your Rights
    if (data.compliance.includes('gdpr')) {
        policy += `
            <h2>6. Your Rights (GDPR)</h2>
            <p>If you are a resident of the European Union, you have the following rights regarding your personal data:</p>
            <ul>
                <li><strong>Right of Access:</strong> You can request information about the personal data we hold about you</li>
                <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your personal data under certain circumstances</li>
                <li><strong>Right to Restrict Processing:</strong> You can request limitation of data processing</li>
                <li><strong>Right to Data Portability:</strong> You can request transfer of your data to another service provider</li>
                <li><strong>Right to Object:</strong> You can object to certain types of data processing</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for data processing at any time</li>
            </ul>
        `;
    }
    
    if (data.compliance.includes('ccpa')) {
        policy += `
            <h2>7. California Privacy Rights (CCPA)</h2>
            <p>If you are a California resident, you have the following rights:</p>
            <ul>
                <li>Right to know what personal information is collected, used, shared, or sold</li>
                <li>Right to delete personal information held by businesses</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
        `;
    }
    
    if (data.compliance.includes('coppa')) {
        policy += `
            <h2>8. Children's Privacy (COPPA)</h2>
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.</p>
        `;
    }
    
    // Cookies
    if (data.dataTypes.includes('cookies')) {
        policy += `
            <h2>9. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device. You can control cookie settings through your browser preferences.</p>
            <p>Types of cookies we use:</p>
            <ul>
                <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
        `;
    }
    
    // Data Retention
    policy += `
        <h2>10. Data Retention</h2>
        <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your personal information, we will securely delete or anonymize it.</p>
    `;
    
    // International Transfers
    policy += `
        <h2>11. International Data Transfers</h2>
        <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information during such transfers.</p>
    `;
    
    // Changes to Privacy Policy
    policy += `
        <h2>12. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the effective date. We encourage you to review this policy periodically.</p>
    `;
    
    // Contact Information
    policy += `
        <h2>13. Contact Us</h2>
        <div class="contact-info">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <p><strong>Email:</strong> ${data.contactEmail}</p>
            <p><strong>Website:</strong> ${data.websiteUrl}</p>
    `;
    
    if (data.companyAddress) {
        policy += `<p><strong>Address:</strong><br>${data.companyAddress.replace(/\n/g, '<br>')}</p>`;
    }
    
    policy += `
            <p>We will respond to your inquiries within a reasonable timeframe and in accordance with applicable law.</p>
        </div>
    `;
    
    policy += `</div>`;
    
    return policy;
}

function displayPolicy(policy) {
    const output = document.getElementById('policy-output');
    output.classList.remove('generating');
    output.innerHTML = policy;
    
    // Show actions and info
    document.getElementById('policy-actions').style.display = 'flex';
    document.getElementById('policy-info').style.display = 'block';
    
    // Store policy for actions
    window.currentPolicy = policy;
}

function updatePolicyInfo(policy) {
    const currentDate = new Date().toLocaleDateString();
    const wordCount = policy.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    const sectionCount = (policy.match(/<h2>/g) || []).length;
    
    document.getElementById('generation-date').textContent = currentDate;
    document.getElementById('word-count').textContent = wordCount;
    document.getElementById('section-count').textContent = sectionCount;
}

function copyPolicy() {
    if (!window.currentPolicy) {
        showNotification('No policy to copy', 'warning');
        return;
    }
    
    // Convert HTML to plain text for copying
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window.currentPolicy;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    navigator.clipboard.writeText(plainText).then(() => {
        showNotification('Privacy policy copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy policy', 'error');
    });
}

function downloadPolicyHTML() {
    if (!window.currentPolicy) {
        showNotification('No policy to download', 'warning');
        return;
    }
    
    const websiteName = document.getElementById('website-name').value.trim() || 'Website';
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - ${websiteName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #09204C; text-align: center; border-bottom: 2px solid #09204C; padding-bottom: 10px; }
        h2 { color: #09204C; margin-top: 30px; }
        h3 { color: #333; }
        .effective-date { text-align: center; font-style: italic; color: #666; margin-bottom: 30px; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        ul { padding-left: 30px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    ${window.currentPolicy}
</body>
</html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${websiteName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_privacy_policy.html`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Privacy policy downloaded as HTML!', 'success');
}

function downloadPolicyTXT() {
    if (!window.currentPolicy) {
        showNotification('No policy to download', 'warning');
        return;
    }
    
    const websiteName = document.getElementById('website-name').value.trim() || 'Website';
    
    // Convert HTML to plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window.currentPolicy;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${websiteName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_privacy_policy.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Privacy policy downloaded as TXT!', 'success');
}

function clearForm() {
    document.getElementById('privacy-form').reset();
    
    // Reset checkboxes to default state
    document.querySelector('input[name="dataTypes"][value="personal"]').checked = true;
    document.querySelector('input[name="compliance"][value="gdpr"]').checked = true;
    
    // Clear output
    document.getElementById('policy-output').innerHTML = `
        <div class="policy-placeholder">
            <div class="placeholder-icon">🔒</div>
            <p>Your privacy policy will appear here</p>
            <p class="placeholder-hint">Fill in the form and click "Generate Privacy Policy"</p>
        </div>
    `;
    
    // Hide actions and info
    document.getElementById('policy-actions').style.display = 'none';
    document.getElementById('policy-info').style.display = 'none';
    
    // Clear stored policy
    window.currentPolicy = null;
    
    showNotification('Form cleared', 'info');
}