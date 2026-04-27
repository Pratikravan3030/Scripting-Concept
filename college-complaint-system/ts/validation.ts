document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm') as HTMLFormElement;
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e: Event) => {
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            const emailInput = document.getElementById('email') as HTMLInputElement;
            
            let isValid = true;
            let errorMessage = "";

            if (passwordInput.value.length < 6) {
                isValid = false;
                errorMessage += "Password must be at least 6 characters long.\n";
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
