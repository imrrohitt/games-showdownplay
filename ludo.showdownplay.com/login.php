<?php
session_start(); // Start the session

$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    try {
        $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $db_username, $db_password, $options);

        // Prepare and execute the query
        $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['userid'] = $user['id'];
            $_SESSION['username'] = $username;
            echo json_encode(['status' => 'success', 'message' => 'Login successful! Redirecting to the homepage...']);
            exit();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
            exit();
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
        exit();
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
        exit();
    }
}