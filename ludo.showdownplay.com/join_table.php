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
    $data = json_decode(file_get_contents('php://input'), true);
    $amount = $data['amount'];
    $user_id = $_SESSION['userid'];

    try {
        $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $db_username, $db_password, $options);

        // Fetch current wallet balance from the wallets table
        $stmt = $pdo->prepare("SELECT balance FROM wallets WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $wallet = $stmt->fetch();
        $current_balance = $wallet['balance'];

        if ($current_balance >= $amount) {
            // Deduct amount from balance
            $stmt = $pdo->prepare("UPDATE wallets SET balance = balance - :amount WHERE user_id = :user_id");
            $stmt->execute(['amount' => $amount, 'user_id' => $user_id]);

            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Insufficient balance']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
    }
}
?>
