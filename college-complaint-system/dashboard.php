<?php
session_start();
require_once 'config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'student') {
    header("Location: index.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM complaints WHERE user_id = $user_id ORDER BY created_at DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - College Complaint System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?></h2>
            <a href="logout.php" class="btn-sm btn-danger badge" style="text-decoration:none; color:white;">Logout</a>
        </div>

        <?php if (isset($_SESSION['flash_error'])): ?>
            <div class="flash-message flash-error"><?= htmlspecialchars($_SESSION['flash_error']) ?></div>
            <?php unset($_SESSION['flash_error']); ?>
        <?php endif; ?>
        <?php if (isset($_SESSION['flash_success'])): ?>
            <div class="flash-message flash-success"><?= htmlspecialchars($_SESSION['flash_success']) ?></div>
            <?php unset($_SESSION['flash_success']); ?>
        <?php endif; ?>

        <div class="grid">
            <!-- Submit Form -->
            <div class="glass-panel" style="height: fit-content;">
                <h3>Submit Complaint</h3>
                <form action="php/complaint.php" method="POST">
                    <input type="hidden" name="action" value="submit">
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" id="title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" name="category" required>
                            <option value="Hostel">Hostel</option>
                            <option value="Academic">Academic</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="5" required></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>

            <!-- Complaints List -->
            <div>
                <h3>My Complaints</h3>
                <?php if ($result && $result->num_rows > 0): ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                        <div class="card">
                            <div class="complaint-header">
                                <h4 style="margin: 0; color: #fff;"><?= htmlspecialchars($row['title']) ?></h4>
                                <?php
                                    $statusClass = str_replace(' ', '-', $row['status']);
                                ?>
                                <span class="badge badge-<?= $statusClass ?>"><?= htmlspecialchars($row['status']) ?></span>
                            </div>
                            <div class="complaint-meta">
                                Category: <?= htmlspecialchars($row['category']) ?> | Submitted: <?= date('M d, Y h:i A', strtotime($row['created_at'])) ?>
                            </div>
                            <p style="color: var(--text); font-size: 0.95rem; line-height: 1.5;">
                                <?= nl2br(htmlspecialchars($row['description'])) ?>
                            </p>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <p style="color: var(--text-muted);">You haven't submitted any complaints yet.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
