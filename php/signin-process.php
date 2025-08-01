<?php
// Include database connection
include 'connect.php';

// Start session
session_start();

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate form data
    if (empty($email) || empty($password)) {
        header("Location: ../auth.html?error=emptyfields");
        exit();
    }

    // Check if user exists
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $row['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['fullname'] = $row['fullname'];
            $_SESSION['email'] = $row['email'];
            
            // Redirect to home page using PHP header
            header("Location: ../index.html");
            exit();
        } else {
            header("Location: ../auth.html?error=invalidpassword");
            exit();
        }
    } else {
        header("Location: ../auth.html?error=usernotfound");
        exit();
    }
}

$conn->close();
?>

