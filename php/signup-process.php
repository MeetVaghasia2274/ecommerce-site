<?php
// Include database connection
include 'connect.php';

// Start session
session_start();

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate form data
    if (empty($fullname) || empty($email) || empty($password) || empty($confirm_password)) {
        header("Location: ../auth.html?error=emptyfields");
        exit();
    }

    if ($password !== $confirm_password) {
        header("Location: ../auth.html?error=passwordmismatch");
        exit();
    }

    // Check if email already exists
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "email already exists <a href='../auth.html'></a>";
        // header("Location: ../auth.html?error=emailexists");
        exit();
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into database
    $sql = "INSERT INTO users (fullname, email, password) VALUES ('$fullname', '$email', '$hashed_password')";

    if ($conn->query($sql) === TRUE) {
        // Set session variables
        $_SESSION['user_id'] = $conn->insert_id;
        $_SESSION['fullname'] = $fullname;
        $_SESSION['email'] = $email;
        echo "Signup sucessfull <a href='..index.html'> go to home page<a/>";
        // Redirect to home page using PHP header
        // header("Location: ../index.html");
        exit();
    } else {
        header("Location: ../auth.html?error=dberror");
        exit();
    }
}

$conn->close();
?>

