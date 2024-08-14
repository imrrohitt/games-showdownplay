<?php
session_start();
$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

header('Content-Type: application/json');

try {
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $db_username, $db_password, $options);

    // Query to get the latest timestamp of updates
    $timestampQuery = "SELECT MAX(updated_at) AS last_update FROM recharge_requests";
    $stmt = $pdo->query($timestampQuery);
    $lastUpdate = $stmt->fetchColumn();

    $query = "
        SELECT r.id AS request_id, r.amount, r.status, r.screenshot, u.full_name, u.mobile, u.username
        FROM recharge_requests r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.status = :status
    ";

    $status_values = ['pending', 'approved', 'rejected'];
    $data = [];

    foreach ($status_values as $status) {
        $stmt = $pdo->prepare($query);
        $stmt->execute(['status' => $status]);
        $data[$status] = $stmt->fetchAll();
    }

    echo json_encode(['last_update' => $lastUpdate, 'data' => $data]);

} catch (PDOException $e) {
    echo json_encode(['error' => "Database error: " . htmlspecialchars($e->getMessage())]);
}
?>
