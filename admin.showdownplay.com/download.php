<?php
$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

if (!isset($_GET['id'])) {
    http_response_code(400);
    exit('Invalid request');
}

$request_id = $_GET['id'];

try {
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $db_username, $db_password, $options);

    $stmt = $pdo->prepare("SELECT screenshot FROM recharge_requests WHERE id = ?");
    $stmt->execute([$request_id]);
    $row = $stmt->fetch();

    if ($row && !empty($row['screenshot'])) {
        header("Content-Type: image/png"); // or the appropriate MIME type
        echo $row['screenshot'];
    } else {
        http_response_code(404);
        exit('Image not found');
    }

} catch (PDOException $e) {
    http_response_code(500);
    exit('Database error: ' . addslashes($e->getMessage()));
}
?>
