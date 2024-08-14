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

        // Start a transaction
        $pdo->beginTransaction();

        // Retrieve the last joined game's amount
        $stmt = $pdo->prepare("SELECT amount FROM transaction_history WHERE user_id = :user_id AND type = 'game_join' ORDER BY id DESC LIMIT 1");
        $stmt->execute(['user_id' => $user_id]);
        $last_game = $stmt->fetch();

        if ($last_game) {
            $amount = $last_game['amount'];
            $doubled_amount = $amount * 2;

            // Update wallet balance
            $stmt = $pdo->prepare("UPDATE wallets SET balance = balance + :doubled_amount WHERE user_id = :user_id");
            $stmt->execute([
                'doubled_amount' => $doubled_amount,
                'user_id' => $user_id
            ]);

            // Log the doubled amount as a win
            $stmt = $pdo->prepare("INSERT INTO transaction_history (user_id, type, amount, details) VALUES (:user_id, :type, :amount, :details)");
            $stmt->execute([
                'user_id' => $user_id,
                'type' => 'win_game', // Set the type here
                'amount' => $doubled_amount,
                'details' => $details
            ]);

            // Commit the transaction
            $pdo->commit();
            echo json_encode(['status' => 'success', 'message' => 'Transaction logged and wallet updated successfully']);
        } else {
            // Rollback the transaction if no previous join game found
            $pdo->rollBack();
            echo json_encode([
                'status' => 'error',
                'message' => "No previous join game transaction found for user id : $user_id"
            ]);
        }
    } catch (PDOException $e) {
        // Rollback the transaction if something failed
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
    } catch (Exception $e) {
        // Rollback the transaction if something unexpected occurred
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
    }
}
?>
