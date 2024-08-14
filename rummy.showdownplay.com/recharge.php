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
    $amount = trim($_POST['amount']);
    $user_id = $_SESSION['userid'];
    
    if ($_FILES['screenshot']['error'] === UPLOAD_ERR_OK) {
        $screenshot_data = file_get_contents($_FILES['screenshot']['tmp_name']);

        try {
            $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $pdo = new PDO($dsn, $db_username, $db_password, $options);

            $pdo->beginTransaction();

            // Insert recharge request
            $stmt = $pdo->prepare("INSERT INTO recharge_requests (user_id, amount, screenshot, status) VALUES (:user_id, :amount, :screenshot, 'pending')");
            $stmt->execute([
                'user_id' => $user_id,
                'amount' => $amount,
                'screenshot' => $screenshot_data
            ]);

            // Record the transaction in transaction_history
            $stmt = $pdo->prepare("INSERT INTO transaction_history (user_id, type, amount, details) VALUES (:user_id, 'recharge', :amount, 'Recharge Request')");
            $stmt->execute([
                'user_id' => $user_id,
                'amount' => $amount
            ]);

            $pdo->commit();

            echo json_encode(['status' => 'success', 'message' => 'Recharge request submitted successfully!']);
        } catch (PDOException $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error uploading screenshot.']);
    }
}
?>
