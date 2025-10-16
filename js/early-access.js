// Brevo form configuration
window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
window.LOCALE = 'en';
window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
window.translation = {
    common: {
        selectedList: '{quantity} list selected',
        selectedLists: '{quantity} lists selected',
        selectedOption: '{quantity} selected',
        selectedOptions: '{quantity} selected',
    }
};
window.AUTOHIDE = Boolean(0);

// Email validation function
function isValidEmail(email) {
    // Basic format check
    const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicFormatRegex.test(email)) {
        return false;
    }

    // Split email into parts
    const [localPart, domain] = email.split('@');
    const [domainName, tld] = domain.split('.');

    // Check local part
    if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.startsWith('...')) {
        return false;
    }

    // Check domain
    if (domain === 'localhost' || 
        domainName.length < 1 || 
        tld.length > 6 || // Most TLDs are 6 chars or less
        /^\d+$/.test(domainName) || // Domain name can't be all numbers
        /[^a-zA-Z0-9-]/.test(domainName)) { // Domain name can only contain letters, numbers, and hyphens
        return false;
    }

    // Additional TLD validation
    const validTLDRegex = /^[a-zA-Z]{2,6}$/;
    if (!validTLDRegex.test(tld)) {
        return false;
    }

    return true;
}

// Handle form submission success
function handleBrevoFormSuccess() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'block';
        setTimeout(() => {
            window.location.href = 'success/success.html';
        }, 1500);
    }
}

// Show email sent message
function showEmailSentMessage() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 8000); // Show for 8 seconds to give time to read
    }
}

// Handle privacy policy validation
function handlePrivacyPolicyValidation() {
    const checkbox = document.getElementById('OPT_IN');
    const label = checkbox.closest('label');
    const errorText = document.getElementById('privacy-policy-error');
    
    if (!checkbox.checked) {
        label.classList.add('privacy-policy-error');
        if (errorText) {
            errorText.style.display = 'block';
        }
        return false;
    } else {
        label.classList.remove('privacy-policy-error');
        if (errorText) {
            errorText.style.display = 'none';
        }
        return true;
    }
}

// Handle email validation UI
function handleEmailValidation(input) {
    const email = input.value.trim();
    const isValid = isValidEmail(email);
    
    // Add or remove validation classes
    if (email && !isValid) {
        input.classList.add('invalid-email');
        input.setCustomValidity('Please enter a valid email address');
    } else {
        input.classList.remove('invalid-email');
        input.setCustomValidity('');
    }
    
    return isValid;
}

// Initialize form handlers when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sib-form');
    if (form) {
        // Add privacy toggle handler
        const privacyToggle = form.querySelector('.privacy-toggle');
        const privacyDetails = document.getElementById('privacy-details');
        
        if (privacyToggle && privacyDetails) {
            privacyToggle.addEventListener('click', () => {
                const isExpanded = privacyToggle.getAttribute('aria-expanded') === 'true';
                privacyToggle.setAttribute('aria-expanded', !isExpanded);
                privacyDetails.hidden = isExpanded;
            });
        }

        // Add privacy policy checkbox handler
        const checkbox = document.getElementById('OPT_IN');
        if (checkbox) {
            checkbox.addEventListener('change', handlePrivacyPolicyValidation);
        }

        // Add email validation handler
        const emailInput = form.querySelector('#EMAIL');
        if (emailInput) {
            emailInput.addEventListener('input', () => handleEmailValidation(emailInput));
            emailInput.addEventListener('blur', () => handleEmailValidation(emailInput));
        }

        // Add form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate email first
            const emailInput = form.querySelector('#EMAIL');
            if (!handleEmailValidation(emailInput)) {
                return;
            }
            
            // Validate privacy policy
            if (!handlePrivacyPolicyValidation()) {
                return;
            }

            // Get the submit button and add loading state
            const submitButton = form.querySelector('.sib-form-block__button');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
                submitButton.textContent = 'Submitting...';
            }

            // Create form data
            const formData = new FormData(form);
            
            // Track form submission in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Early Access',
                    'event_label': 'Waitlist Signup',
                    'value': 1
                });
            }

            // Submit the form using fetch
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Show the email sent message regardless of response
                showEmailSentMessage();
                // Reset the form
                form.reset();
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showEmailSentMessage();
            })
            .finally(() => {
                // Reset button state
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.textContent = 'SUBMIT';
                }
            });
        });
    }
}); 