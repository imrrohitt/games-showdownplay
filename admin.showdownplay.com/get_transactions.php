<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit();
}

$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

try {
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $db_username, $db_password, $options);

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'];
    $action = isset($data['action']) ? $data['action'] : '';

    if ($action === 'details') {
        // Fetch user details including the password
        $stmt = $pdo->prepare("SELECT id, full_name, mobile, email, username, dob FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        if ($user) {
            echo json_encode(['status' => 'success', 'user' => $user]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
        }
    } else {
        // Fetch transactions
        $stmt = $pdo->prepare("SELECT * FROM transaction_history WHERE user_id = ?");
        $stmt->execute([$userId]);
        $transactions = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'transactions' => $transactions]);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => htmlspecialchars($e->getMessage())]);
}
