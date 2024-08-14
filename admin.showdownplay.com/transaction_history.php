<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    header("Location: login.php");
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

    // Fetch transaction history
    $stmt = $pdo->query("SELECT * FROM transaction_history ORDER BY transaction_date DESC");
    $transactions = $stmt->fetchAll();

    // Get total received amount
    $stmt = $pdo->query("SELECT SUM(amount) FROM transaction_history WHERE type = 'recharge'");
    $total_received = $stmt->fetchColumn();

} catch (PDOException $e) {
    $error = "Database error: " . htmlspecialchars($e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction History</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Transaction History</h1>
        <p>Total Received Amount: <?php echo htmlspecialchars($total_received); ?> INR</p>
        <form action="index.php" method="get">
            <button type="submit" class="button">Back to Dashboard</button>
        </form>
    </header>

    <div id="table-container" class="table-container">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Transaction Date</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($transactions as $transaction): ?>
                <tr>
                    <td><?php echo htmlspecialchars($transaction['id']); ?></td>
                    <td><?php echo htmlspecialchars($transaction['user_id']); ?></td>
                    <td><?php echo htmlspecialchars($transaction['type']); ?></td>
                    <td><?php echo htmlspecialchars($transaction['amount']); ?></td>
                    <td><?php echo htmlspecialchars($transaction['transaction_date']); ?></td>
                    <td><?php echo htmlspecialchars($transaction['details']); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
