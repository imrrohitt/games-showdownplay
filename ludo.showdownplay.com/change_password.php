<?php
session_start();
header('Content-Type: application/json');

$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

// Check if the user is logged in
if (!isset($_SESSION['userid'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

// Process the password change request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $currentPassword = trim($_POST['current_password']);
    $newPassword = trim($_POST['new_password']);
    $user_id = $_SESSION['userid'];

    try {
        // Create a new PDO instance for the database connection
        $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $db_username, $db_password, $options);

        // Start a transaction
        $pdo->beginTransaction();

        // Fetch the user's current password from the database
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $user = $stmt->fetch();

        if ($user) {
            // Verify the current password
            if (password_verify($currentPassword, $user['password'])) {
                // Hash the new password
                $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

                // Update the password in the database
                $stmt = $pdo->prepare("UPDATE users SET password = :new_password WHERE id = :user_id");
                $stmt->execute([
                    'new_password' => $newHashedPassword,
                    'user_id' => $user_id
                ]);

                // Commit the transaction
                $pdo->commit();

                echo json_encode(['status' => 'success', 'message' => 'Password updated successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        }
    } catch (PDOException $e) {
        // Rollback the transaction in case of an error
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . addslashes($e->getMessage())]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . addslashes($e->getMessage())]);
    }
}
?>
