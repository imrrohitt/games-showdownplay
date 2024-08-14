<?php
session_start();
header('Content-Type: application/json');

$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

if (!isset($_SESSION['userid'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

try {
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $db_username, $db_password, $options);

    $user_id = $_SESSION['userid'];

    // Get wallet balance
    $stmt = $pdo->prepare("SELECT balance FROM wallets WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $wallet = $stmt->fetch();

    if ($wallet) {
        $balance = (float)$wallet['balance'];

        // Check the latest request status
        $stmt = $pdo->prepare("SELECT status FROM recharge_requests WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 1");
        $stmt->execute(['user_id' => $user_id]);
        $request = $stmt->fetch();
        
        $payment_status = $request ? $request['status'] : 'pending';

        echo json_encode(['status' => 'success', 'balance' => $balance, 'payment_status' => $payment_status]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Wallet not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
}
?>
