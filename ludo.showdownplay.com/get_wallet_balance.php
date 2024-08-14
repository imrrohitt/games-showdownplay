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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $type = $input['type'];
    $amount = $input['amount'];
    $details = $input['details'];
    $user_id = $_SESSION['userid'];

    try {
        $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $db_username, $db_password, $options);

        $stmt = $pdo->prepare("INSERT INTO transaction_history (user_id, type, amount, details) VALUES (:user_id, :type, :amount, :details)");
        $stmt->execute([
            'user_id' => $user_id,
            'type' => $type,
            'amount' => $amount,
            'details' => $details
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Transaction logged successfully']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
    }
}
?>
