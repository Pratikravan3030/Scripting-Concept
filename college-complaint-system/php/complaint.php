<?php
session_start();
require_once '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Student: Submit complaint
    if ($action === 'submit') {
        $user_id = $_SESSION['user_id'];
        $title = $conn->real_escape_string($_POST['title']);
        $description = $conn->real_escape_string($_POST['description']);
        $category = $conn->real_escape_string($_POST['category']);

        $stmt = $conn->prepare("INSERT INTO complaints (user_id, title, description, category) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $title, $description, $category);
        
        if ($stmt->execute()) {
            $_SESSION['flash_success'] = "Complaint submitted successfully!";
        } else {
            $_SESSION['flash_error'] = "Failed to submit complaint.";
        }
        $stmt->close();
        header("Location: ../dashboard.php");
        exit;
    }
    
    // Admin: Update status via AJAX
    if ($action === 'update_status' && $_SESSION['user_role'] === 'admin') {
        $complaint_id = intval($_POST['id']);
        $status = $conn->real_escape_string($_POST['status']);

        $stmt = $conn->prepare("UPDATE complaints SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $complaint_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        $stmt->close();
        exit;
    }

    // Admin: Delete complaint via AJAX
    if ($action === 'delete' && $_SESSION['user_role'] === 'admin') {
        $complaint_id = intval($_POST['id']);
        $stmt = $conn->prepare("DELETE FROM complaints WHERE id = ?");
        $stmt->bind_param("i", $complaint_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        $stmt->close();
        exit;
    }
}
?>
