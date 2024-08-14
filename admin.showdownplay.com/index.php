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

    // Fetch recharge requests with user information
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

    // Handle approval or rejection
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $request_id = $_POST['request_id'];
        $action = $_POST['action'];

        if ($action === 'approve') {
            // Start a transaction
            $pdo->beginTransaction();

            try {
                // Update the request status
                $stmt = $pdo->prepare("UPDATE recharge_requests SET status = 'approved' WHERE id = ?");
                $stmt->execute([$request_id]);

                // Fetch the request details
                $stmt = $pdo->prepare("SELECT amount, user_id FROM recharge_requests WHERE id = ?");
                $stmt->execute([$request_id]);
                $recharge_request = $stmt->fetch();

                if ($recharge_request) {
                    $amount = $recharge_request['amount'];
                    $user_id = $recharge_request['user_id'];

                    // Check if wallet exists for the user
                    $stmt = $pdo->prepare("SELECT * FROM wallets WHERE user_id = ?");
                    $stmt->execute([$user_id]);
                    $wallet = $stmt->fetch();

                    if ($wallet) {
                        // Update existing wallet balance
                        $stmt = $pdo->prepare("UPDATE wallets SET balance = balance + ? WHERE user_id = ?");
                        $stmt->execute([$amount, $user_id]);
                    } else {
                        // Create a new wallet for the user
                        $stmt = $pdo->prepare("INSERT INTO wallets (user_id, balance) VALUES (?, ?)");
                        $stmt->execute([$user_id, $amount]);
                    }
                }

                // Commit the transaction
                $pdo->commit();
                $message = "Recharge request approved and balance updated.";
                $message_type = 'success';

            } catch (Exception $e) {
                // Rollback the transaction if something goes wrong
                $pdo->rollBack();
                $error = "Failed to update request and balance: " . htmlspecialchars($e->getMessage());
                $message_type = 'error';
            }

        } elseif ($action === 'reject') {
            // Update the request status
            $stmt = $pdo->prepare("UPDATE recharge_requests SET status = 'rejected' WHERE id = ?");
            $stmt->execute([$request_id]);

            $message = "Recharge request rejected.";
            $message_type = 'success';
        }

        // Redirect to refresh the page and show updated data
        header("Location: index.php?message=$message&message_type=$message_type");
        exit();
    }

    if (isset($_GET['ajax']) && $_GET['ajax'] === 'true') {
        echo json_encode($data);
        exit();
    }

} catch (PDOException $e) {
    $error = "Database error: " . htmlspecialchars($e->getMessage());
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Loader styles */
        .loader {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 16px solid #f3f3f3;
            border-top: 16px solid #3498db;
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Toast styles */
        .toast {
            visibility: hidden;
            min-width: 250px;
            margin-left: -125px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            position: fixed;
            z-index: 1;
            left: 50%;
            bottom: 30px;
            font-size: 17px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }

        .toast.show {
            visibility: visible;
            opacity: 1;
        }

        /* Logout button styles */
        .logout-btn {
            background-color: #e74c3c;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .logout-btn:hover {
            background-color: #c0392b;
        }
    </style>
    <script>
        function fetchUpdatedRequests() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'index.php?ajax=true', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    updateTable(data);
                }
            };
            xhr.send();
        }

        function updateTable(data) {
            var container = document.getElementById('table-container');
            container.innerHTML = '';

            for (var status in data) {
                var requests = data[status];
                var table = document.createElement('table');
                var thead = document.createElement('thead');
                var tbody = document.createElement('tbody');

                var headers = ['Request ID', 'Full Name', 'Mobile', 'Username', 'Amount', 'Screenshot', 'Status'];
                if (status === 'pending') headers.push('Action');

                var tr = document.createElement('tr');
                headers.forEach(function(header) {
                    var th = document.createElement('th');
                    th.textContent = header;
                    tr.appendChild(th);
                });
                thead.appendChild(tr);
                table.appendChild(thead);

                requests.forEach(function(row) {
                    var tr = document.createElement('tr');
                    Object.keys(row).forEach(function(key) {
                        var td = document.createElement('td');
                        td.textContent = row[key] || 'N/A';
                        tr.appendChild(td);
                    });

                    if (status === 'pending') {
                        var td = document.createElement('td');
                        var form = document.createElement('form');
                        form.method = 'post';
                        form.className = 'action-form';

                        var approveButton = document.createElement('button');
                        approveButton.type = 'submit';
                        approveButton.name = 'action';
                        approveButton.value = 'approve';
                        approveButton.textContent = 'Approve';
                        approveButton.className = 'button approve-btn';

                        var rejectButton = document.createElement('button');
                        rejectButton.type = 'submit';
                        rejectButton.name = 'action';
                        rejectButton.value = 'reject';
                        rejectButton.textContent = 'Reject';
                        rejectButton.className = 'button reject-btn';

                        var input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'request_id';
                        input.value = row.request_id;

                        form.appendChild(input);
                        form.appendChild(approveButton);
                        form.appendChild(rejectButton);
                        td.appendChild(form);
                        tr.appendChild(td);
                    }

                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                container.appendChild(table);
            }
        }

        function showToast(message, type) {
            var toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast show ' + type;
            setTimeout(function() {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }

        document.addEventListener('DOMContentLoaded', function() {
            var loader = document.getElementById('loader');
            var message = new URLSearchParams(window.location.search).get('message');
            var message_type = new URLSearchParams(window.location.search).get('message_type');

            if (message && message_type) {
                showToast(message, message_type);
            }

            fetchUpdatedRequests(); // Fetch initial data
            setInterval(fetchUpdatedRequests, 30000); // Fetch data every 30 seconds

            // Show loader during data fetching
            document.addEventListener('readystatechange', function() {
                if (document.readyState === 'loading') {
                    loader.style.display = 'block';
                } else {
                    loader.style.display = 'none';
                }
            });
        });
    </script>
</head>
<body>
   <header class="header">
        <div class="header-left">
            <h1>Ludo Admin Panel</h1>
            <p>Manage recharge requests efficiently</p>
        </div>
        <div class="header-right">
            <form action="all_users.php" method="get" class="inline-form">
                <button type="submit" class="button">Show All Users</button>
            </form>
            <form action="transaction_history.php" method="get" class="inline-form">
                <button type="submit" class="button">Show Transaction History</button>
            </form>
            
            <form action="logout.php" method="post" class="logout-form">
                <button type="submit" class="logout-btn">Logout</button>
            </form>
        </div>
    </header>

    <div id="loader" class="loader"></div>
    <div id="toast" class="toast"></div>

    <div id="table-container" class="table-container">
        <?php foreach ($data as $status => $requests): ?>
            <h2><?php echo ucfirst($status); ?> Recharge Requests</h2>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Request ID</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Username</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Screenshot</th>
                        <th scope="col">Status</th>
                        <?php if ($status === 'pending'): ?>
                            <th>Action</th>
                        <?php endif; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($requests as $row): ?>
                    <tr>
                        <td data-label="Request ID"><?php echo htmlspecialchars($row['request_id'] ?? 'N/A'); ?></td>
                        <td data-label="Full Name"><?php echo htmlspecialchars($row['full_name'] ?? 'N/A'); ?></td>
                        <td data-label="Mobile"><?php echo htmlspecialchars($row['mobile'] ?? 'N/A'); ?></td>
                        <td  data-label="Username" ><?php echo htmlspecialchars($row['username'] ?? 'N/A'); ?></td>
                        <td data-label="Amount"><?php echo htmlspecialchars($row['amount'] ?? 'N/A'); ?></td>
                        <td data-label="Screenshot">
                            <?php if (!empty($row['screenshot'])): ?>
                                <a href="download.php?id=<?php echo htmlspecialchars($row['request_id']); ?>" target="_blank" class="button view-btn">View</a>
                                <a href="download.php?id=<?php echo htmlspecialchars($row['request_id']); ?>" download class="button download-btn">Download</a>
                            <?php else: ?>
                                <p>Image not found</p>
                            <?php endif; ?>
                        </td>
                        <td data-label="Status"><?php echo htmlspecialchars($row['status'] ?? 'N/A'); ?></td>
                        <?php if ($status === 'pending'): ?>
                        <td data-label="Action">
                            <form method="post" class="action-form">
                                <input type="hidden" name="request_id" value="<?php echo htmlspecialchars($row['request_id'] ?? ''); ?>">
                                <button type="submit" name="action" value="approve" class="button approve-btn">Approve</button>
                                <button type="submit" name="action" value="reject" class="button reject-btn">Reject</button>
                            </form>
                        </td>
                        <?php endif; ?>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endforeach; ?>
    </div>
</body>
</html>
