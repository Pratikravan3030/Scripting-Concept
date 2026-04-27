<?php
session_start();
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'login') {
        $email = $conn->real_escape_string($_POST['email']);
        $password = $_POST['password'];

        $sql = "SELECT id, name, password, role FROM users WHERE email = '$email'";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_role'] = $user['role'];

                if ($user['role'] === 'admin') {
                    header("Location: ../admin.php");
                } else {
                    header("Location: ../dashboard.php");
                }
                exit;
            } else {
                $_SESSION['flash_error'] = "Invalid password!";
            }
        } else {
            $_SESSION['flash_error'] = "User not found!";
        }
        header("Location: ../index.php");
        exit;
    } elseif ($action === 'signup') {
        $name = $conn->real_escape_string($_POST['name']);
        $email = $conn->real_escape_string($_POST['email']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Check if email exists
        $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
        if ($check && $check->num_rows > 0) {
            $_SESSION['flash_error'] = "Email already registered!";
            header("Location: ../signup.php");
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password);
        
        if ($stmt->execute()) {
            $_SESSION['flash_success'] = "Registration successful! Please login.";
            header("Location: ../index.php");
        } else {
            $_SESSION['flash_error'] = "Registration failed.";
            header("Location: ../signup.php");
        }
        $stmt->close();
        exit;
    }
}
?>
