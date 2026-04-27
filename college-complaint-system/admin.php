<?php
session_start();
require_once 'config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: index.php");
    exit;
}

$sql = "
    SELECT c.*, u.name as student_name, u.email as student_email 
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - College Complaint System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container" style="max-width: 1400px;">
        <div class="header">
            <h2>Admin Dashboard</h2>
            <a href="logout.php" class="btn-sm btn-danger badge" style="text-decoration:none; color:white;">Logout</a>
        </div>

        <div class="glass-panel" style="margin-bottom: 2rem;">
            <h3>Manage Complaints</h3>
            
            <div class="filter-bar">
                <div>
                    <label for="filterCategory" style="display:inline-block; margin-right: 0.5rem;">Filter Category:</label>
                    <select id="filterCategory">
                        <option value="">All Categories</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Academic">Academic</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label for="filterStatus" style="display:inline-block; margin-right: 0.5rem;">Filter Status:</label>
                    <select id="filterStatus">
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Title & Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($result && $result->num_rows > 0): ?>
                            <?php while ($row = $result->fetch_assoc()): ?>
                                <?php $statusClass = str_replace(' ', '-', $row['status']); ?>
                                <tr data-category="<?= htmlspecialchars($row['category']) ?>" data-status="<?= htmlspecialchars($row['status']) ?>">
                                    <td>#<?= $row['id'] ?></td>
                                    <td>
                                        <strong style="color: #fff;"><?= htmlspecialchars($row['student_name']) ?></strong><br>
                                        <span style="font-size: 0.8rem; color: var(--text-muted);"><?= htmlspecialchars($row['student_email']) ?></span>
                                    </td>
                                    <td style="max-width: 300px;">
                                        <strong style="color: #fff;"><?= htmlspecialchars($row['title']) ?></strong><br>
                                        <span style="font-size: 0.85rem; color: var(--text-muted);"><?= htmlspecialchars(substr($row['description'], 0, 50)) ?>...</span>
                                    </td>
                                    <td><?= htmlspecialchars($row['category']) ?></td>
                                    <td style="font-size: 0.85rem;"><?= date('M d, Y', strtotime($row['created_at'])) ?></td>
                                    <td>
                                        <span class="badge badge-<?= $statusClass ?>"><?= htmlspecialchars($row['status']) ?></span>
                                    </td>
                                    <td>
                                        <div class="admin-actions">
                                            <select class="status-select" data-id="<?= $row['id'] ?>">
                                                <option value="Pending" <?= $row['status'] == 'Pending' ? 'selected' : '' ?>>Pending</option>
                                                <option value="In Progress" <?= $row['status'] == 'In Progress' ? 'selected' : '' ?>>In Progress</option>
                                                <option value="Resolved" <?= $row['status'] == 'Resolved' ? 'selected' : '' ?>>Resolved</option>
                                            </select>
                                            <button class="btn-sm btn-danger delete-btn" data-id="<?= $row['id'] ?>">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" class="text-center">No complaints found.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script src="js/admin.js"></script>
</body>
</html>
