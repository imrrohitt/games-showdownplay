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

if (isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    // Fetch the user's current password from the database
    $user_id = $_SESSION['user_id']; // Assuming you have stored user_id in session
    $query = "SELECT password FROM users WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // Verify the current password
    if (password_verify($current_password, $user['password'])) {
        // Check if new password and confirm password match
        if ($new_password === $confirm_password) {
            // Hash the new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            // Update the password in the database
            $update_query = "UPDATE users SET password = ? WHERE id = ?";
            $update_stmt = $conn->prepare($update_query);
            $update_stmt->bind_param('si', $hashed_password, $user_id);
            if ($update_stmt->execute()) {
                echo "<script>alert('Password updated successfully.');</script>";
            } else {
                echo "<script>alert('Error updating password. Please try again.');</script>";
            }
        } else {
            echo "<script>alert('New password and confirm password do not match.');</script>";
        }
    } else {
        echo "<script>alert('Current password is incorrect.');</script>";
    }

    // Close the modal and reload the page
    echo "<script>closePasswordModal(); location.reload();</script>";
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
