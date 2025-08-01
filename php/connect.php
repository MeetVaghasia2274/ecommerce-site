<?php
// Database connection
$servername = "sql100.infinityfree.com";
$username = "if0_39611098";
$password = "Skpi051wu0s";
$dbname = "if0_39611098_shopeasy";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>