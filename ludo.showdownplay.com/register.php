<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = gethostname();
$db_username = "showdt4k_rohit_test";
$db_password = "Rohit@4077175";
$dbname = "showdt4k_game_ludo_db";

$response = [
    'message' => '',
    'error' => '',
    'username' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = trim($_POST['full_name']);
    $mobile = trim($_POST['mobile']);
    $dob = trim($_POST['dob']);
    $form_password = trim($_POST['password']);

    if (strlen($form_password) < 6) {
        $response['error'] = "Password must be at least 6 characters long.";
    } elseif (empty($full_name)) {
        $response['error'] = "Full Name is required.";
    } elseif (!$dob) {
        $response['error'] = "Date of Birth is required.";
    } else {
        // Generate username and random email
        $dobFormatted = date('md', strtotime($dob));
        $first_name = explode(' ', $full_name)[0];
        $username = strtolower($first_name) . $dobFormatted;
        $random_email = strtolower($first_name) . mt_rand(1000, 9999) . "@example.com";
        $form_password_hashed = password_hash($form_password, PASSWORD_BCRYPT);

        try {
            $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $pdo = new PDO($dsn, $db_username, $db_password, $options);

            // Ensure the users table exists
            $query = "
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    full_name VARCHAR(255),
                    mobile VARCHAR(20),
                    email VARCHAR(255) UNIQUE,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    dob DATE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ";
            $pdo->exec($query);

            // Insert the new user
             // Insert the new user
            $stmt = $pdo->prepare("INSERT INTO users (full_name, mobile, email, username, password, dob, type) VALUES (:full_name, :mobile, :email, :username, :password, :dob, :type)");
            $stmt->execute([
                'full_name' => $full_name,
                'mobile' => $mobile,
                'email' => $random_email,
                'username' => $username,
                'password' => $form_password_hashed,
                'dob' => $dob,
                'type' => 'ludo'
            ]);

            // Get the newly inserted user's ID
            $user_id = $pdo->lastInsertId();

            // Ensure the wallets table exists
            $query = "
                CREATE TABLE IF NOT EXISTS wallets (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    balance DECIMAL(10, 2) DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ";
            $pdo->exec($query);

            // Insert a wallet record for the new user with a balance of 0
            $stmt = $pdo->prepare("INSERT INTO wallets (user_id, balance) VALUES (:user_id, 0)");
            if ($stmt->execute(['user_id' => $user_id])) {
                $response['message'] = "Registration successful. Your username is: $username";
                $response['username'] = $username;
            } else {
                $response['error'] = "Failed to create wallet.";
            }
        } catch (PDOException $e) {
            $response['error'] = "Database error: " . addslashes($e->getMessage());
        } catch (Exception $e) {
            $response['error'] = "An unexpected error occurred: " . addslashes($e->getMessage());
        }
    }

    echo json_encode($response);
    exit();
}
