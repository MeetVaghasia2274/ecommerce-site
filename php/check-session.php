<?php
// Start session
session_start();

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // User is logged in
    $response = [
        'loggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'fullname' => $_SESSION['fullname'],
            'email' => $_SESSION['email']
        ]
    ];
} else {
    // User is not logged in
    $response = [
        'loggedIn' => false
    ];
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>

