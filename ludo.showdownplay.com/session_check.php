<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['userid'])) {
    // If not logged in, redirect to the login page
    header("Location: login_html.php");
    exit();
}
?>