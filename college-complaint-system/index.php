<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - College Complaint System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container auth-container">
        <div class="glass-panel">
            <h1>Welcome Back</h1>
            <p class="text-center mb-8" style="color: var(--text-muted);">College Complaint Management System</p>
            
            <?php if (isset($_SESSION['flash_error'])): ?>
                <div class="flash-message flash-error"><?= htmlspecialchars($_SESSION['flash_error']) ?></div>
                <?php unset($_SESSION['flash_error']); ?>
            <?php endif; ?>
            <?php if (isset($_SESSION['flash_success'])): ?>
                <div class="flash-message flash-success"><?= htmlspecialchars($_SESSION['flash_success']) ?></div>
                <?php unset($_SESSION['flash_success']); ?>
            <?php endif; ?>

            <form action="php/auth.php" method="POST">
                <input type="hidden" name="action" value="login">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
            </form>
            <p class="text-center mt-4" style="color: var(--text-muted); font-size: 0.875rem;">
                Don't have an account? <a href="signup.php">Sign up here</a>
            </p>
        </div>
    </div>
</body>
</html>
