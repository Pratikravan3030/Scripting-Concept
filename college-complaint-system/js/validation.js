"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            var passwordInput = document.getElementById('password');
            var emailInput = document.getElementById('email');
            var isValid = true;
            var errorMessage = "";
            if (passwordInput.value.length < 6) {
                isValid = false;
                errorMessage += "Password must be at least 6 characters long.\n";
            }
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                errorMessage += "Please enter a valid email address.\n";
            }
            if (!isValid) {
                e.preventDefault();
                alert(errorMessage);
            }
        });
    }
});
