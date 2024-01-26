// index.js
function validateForm() {
    var emailInput = document.getElementById('emailInput');
    var emailValue = emailInput.value.trim();

    // Check if the email is not empty and matches the email regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === '' || !emailRegex.test(emailValue)) {
        alert('Please enter a valid email address.');
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}
