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

    $stmt = $pdo->prepare("SELECT * FROM transaction_history WHERE user_id = :user_id ORDER BY transaction_date DESC");
    $stmt->execute(['user_id' => $_SESSION['userid']]);
    $history = $stmt->fetchAll();

    $historyHtml = '';

    if ($history) {
        foreach ($history as $transaction) {
            $historyHtml .= '<p>' . $transaction['transaction_date'] . ' - ' . ucfirst($transaction['type']) . ' - ₹' . $transaction['amount'] . '.00' . ' - ' . $transaction['details'] . '</p>';
        }
    } else {
        $historyHtml = '<p>No transaction history available.</p>';
    }

    echo json_encode(['status' => 'success', 'history' => $historyHtml]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
}
?>
