<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - College Complaint System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container auth-container">
        <div class="glass-panel">
            <h2>Create Account</h2>
            <p class="text-center mb-8" style="color: var(--text-muted);">Student Registration</p>
            
            <?php if (isset($_SESSION['flash_error'])): ?>
                <div class="flash-message flash-error"><?= htmlspecialchars($_SESSION['flash_error']) ?></div>
                <?php unset($_SESSION['flash_error']); ?>
            <?php endif; ?>

            <form action="php/auth.php" method="POST" id="signupForm">
                <input type="hidden" name="action" value="signup">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password (min 6 chars)</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <p class="text-center mt-4" style="color: var(--text-muted); font-size: 0.875rem;">
                Already have an account? <a href="index.php">Login here</a>
            </p>
        </div>
    </div>
    <script src="js/validation.js"></script>
</body>
</html>
