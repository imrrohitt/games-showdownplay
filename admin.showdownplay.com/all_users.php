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

    // Initialize variables for search functionality
    $search_query = "";
    $filter = "";

    if (isset($_GET['search_query']) && isset($_GET['filter'])) {
        $search_query = $_GET['search_query'];
        $filter = $_GET['filter'];

        // Build query dynamically based on the filter
        switch ($filter) {
            case 'username':
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username LIKE ?");
                break;
            case 'email':
                $stmt = $pdo->prepare("SELECT * FROM users WHERE email LIKE ?");
                break;
            case 'full_name':
                $stmt = $pdo->prepare("SELECT * FROM users WHERE full_name LIKE ?");
                break;
            default:
                $stmt = $pdo->prepare("SELECT * FROM users");
                break;
        }
        $stmt->execute(['%' . $search_query . '%']);
    } else {
        // Fetch all users if no search query
        $stmt = $pdo->query("SELECT * FROM users");
    }

    $users = $stmt->fetchAll();

    // Get total user count
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $user_count = $stmt->fetchColumn();
    
    // // Handle password update
    // if (isset($_POST['update_password'])) {
    //     $user_id = $_POST['user_id'];
    //     $new_password = $_POST['new_password'];
        
    //     // Hash the new password
    //     $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

    //     // Update the password in the database
    //     $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    //     $stmt->execute([$hashed_password, $user_id]);

    //     // Return a success message
    //     echo json_encode(['status' => 'success', 'message' => 'Password updated successfully.']);
    //     exit();
    // }

} catch (PDOException $e) {
    $error = "Database error: " . htmlspecialchars($e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Users</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            height: fit-content;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        /* Toast Styles */
        .toast {
            visibility: hidden;
            min-width: 250px;
            margin: 0 auto;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            position: fixed;
            z-index: 1;
            left: 50%;
            bottom: 30px;
            transform: translateX(-50%);
            font-size: 17px;
            white-space: nowrap;
            padding: 10px;
        }

        .toast.show {
            visibility: visible;
            -webkit-animation: fadein 0.5s, fadeout 0.5s 2s;
            animation: fadein 0.5s, fadeout 0.5s 2s;
        }
        
        button {
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
            font-size: 14px;
            text-align: center;
            display: inline-block;
            margin-right: 5px;
            background-color: blue;
        }

        @-webkit-keyframes fadein {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadein {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @-webkit-keyframes fadeout {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @keyframes fadeout {
            from { opacity: 1; }
            to { opacity: 0; }
        }
 /* Existing styles... */
/* Existing styles... */

        .search-bar {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap; /* Allows wrapping on smaller screens */
        }

        .search-bar input[type="text"],
        .search-bar select,
        .search-bar button,
        .reset-button {
            padding: 10px;
            font-size: 16px;
            margin-bottom: 10px; /* Space between elements on small screens */
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .search-bar button,
        .reset-button {
            border: none;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-bottom: 10px;
        }

        .reset-button {
            background-color: #28a745;
        }

        .search-bar button:hover,
        .reset-button:hover {
            background-color: #0056b3;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
            .search-bar {
                flex-direction: column; /* Stack elements vertically on smaller screens */
                align-items: stretch; /* Full width on smaller screens */
            }

            .search-bar input[type="text"],
            .search-bar select,
            .search-bar button,
            .reset-button {
                width: 100%; /* Full width input and buttons on smaller screens */
                margin-right: 0;
                margin-bottom: 10px; /* Add space between elements */
            }
        }

        @media (max-width: 480px) {
            .search-bar input[type="text"],
            .search-bar select,
            .search-bar button,
            .reset-button {
                font-size: 14px; /* Slightly smaller font size on very small screens */
                padding: 8px; /* Adjust padding for smaller screens */
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>All Users</h1>
        <p>Total Users: <?php echo htmlspecialchars($user_count); ?></p>
        <form action="index.php" method="get">
            <button type="submit" class="button">Back to Dashboard</button>
        </form>
    </header>

    <!-- Search Bar -->
    <div class="search-bar">
        <form action="all_users.php" method="get" style="display: flex;">
            <select name="filter" required>
                <option value="username" <?php echo $filter == 'username' ? 'selected' : ''; ?>>Username</option>
                <option value="email" <?php echo $filter == 'email' ? 'selected' : ''; ?>>Email</option>
                <option value="full_name" <?php echo $filter == 'full_name' ? 'selected' : ''; ?>>Full Name</option>
              
            </select>
            <input type="text" name="search_query" value="<?php echo htmlspecialchars($search_query); ?>" placeholder="Search..." required>
            <button type="submit">Search</button>
        </form>
        <form action="all_users.php" method="get">
            <button type="submit" class="reset-button">Reset Filter</button>
        </form>
    </div>


    <div id="table-container" class="table-container">
        <table>
            <thead>
                <tr>
                    <th scope="col" >ID</th>
                    <th scope="col">Full Name</th>
                    <th  scope="col">Mobile</th>
                    <th  scope="col">Username</th>
                    <th scope="col" >Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $user): ?>
                <tr>
                    <td data-label="ID"><?php echo htmlspecialchars($user['id']); ?></td>
                    <td data-label="Full Name"><?php echo htmlspecialchars($user['full_name']); ?></td>
                    <td data-label="Mobile"><?php echo htmlspecialchars($user['mobile']); ?></td>
                    <td data-label="Username"><?php echo htmlspecialchars($user['username']); ?></td>
                    <td data-label="Actions">
                        <button onclick="viewTransactions(<?php echo htmlspecialchars($user['id']); ?>)">Transactions</button>
                        <button onclick="viewUserDetails(<?php echo htmlspecialchars($user['id']); ?>)">Details</button>
                        <button onclick="openUpdatePasswordModal(<?php echo htmlspecialchars($user['id']); ?>)">Update Password</button>
                    </td>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

<!-- Modal for Updating Password -->
    <div id="updatePasswordModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('updatePasswordModal')">&times;</span>
            <h2>Update Password</h2>
            <form id="updatePasswordForm">
                <input type="hidden" id="updateUserId" name="user_id" value="">
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="new_password" required>
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirm_password" required>
                <button type="submit">Update Password</button>
            </form>
            <div id="updatePasswordResult"></div>
        </div>
    </div>
    <!-- Modal for Transaction History -->
    <div id="transactionModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('transactionModal')">&times;</span>
            <h2>User Transactions</h2>
            <div id="transactionContent">Loading...</div>
        </div>
    </div>

    <!-- Modal for User Details -->
    <div id="detailsModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('detailsModal')">&times;</span>
            <h2>User Details</h2>
            <div id="detailsContent">Loading...</div>
        </div>
    </div>

    <script>
        // Function to show the modal with user transactions
        function viewTransactions(userId) {
            const modal = document.getElementById('transactionModal');
            const transactionContent = document.getElementById('transactionContent');

            fetch('get_transactions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    let html = '<table><thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Date</th><th>Details</th></tr></thead><tbody>';
                    data.transactions.forEach(transaction => {
                        html += `<tr>
                                    <td>${transaction.id}</td>
                                    <td>${transaction.type}</td>
                                    <td>${transaction.amount}</td>
                                    <td>${transaction.transaction_date}</td>
                                    <td>${transaction.details}</td>
                                 </tr>`;
                    });
                    html += '</tbody></table>';
                    transactionContent.innerHTML = html;
                } else {
                    transactionContent.innerHTML = 'Error loading transactions.';
                }
                modal.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error:', error);
                transactionContent.innerHTML = 'An error occurred while fetching transactions.';
            });
        }

        // Function to show the modal with user details
       function viewUserDetails(userId) {
    const modal = document.getElementById('detailsModal');
    const detailsContent = document.getElementById('detailsContent');

    fetch('get_transactions.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, action: 'details' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            let html = `<p>Full Name: ${data.user.full_name}</p>
                        <p>Email: ${data.user.email}</p>
                        <p>Username: ${data.user.username}</p>
                        <p>Date of Birth: ${data.user.dob}</p>`
            detailsContent.innerHTML = html;
        } else {
            detailsContent.innerHTML = 'Error loading user details.';
        }
        modal.style.display = 'flex';
    })
    .catch(error => {
        console.error('Error:', error);
        detailsContent.innerHTML = 'An error occurred while fetching user details.';
    });
}


        // Function to close the modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Hide the modal when clicking outside of the modal content
        window.addEventListener('click', function(event) {
            if (event.target === document.getElementById('transactionModal')) {
                closeModal('transactionModal');
            }
            if (event.target === document.getElementById('detailsModal')) {
                closeModal('detailsModal');
            }
        });
        
        // Function to open the Update Password Modal
        function openUpdatePasswordModal(userId) {
            document.getElementById('updateUserId').value = userId;
            document.getElementById('updatePasswordModal').style.display = 'block';
        }

        // Function to close the modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Function to handle the Update Password Form submission
        document.getElementById('updatePasswordForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const userId = document.getElementById('updateUserId').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const resultDiv = document.getElementById('updatePasswordResult');

            // Basic validation
            if (newPassword !== confirmPassword) {
                resultDiv.innerHTML = 'Passwords do not match.';
                return;
            }
     
            fetch('update_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    new_password: newPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                 console.log("response, ",data);
                if (data.status === 'success') {
                    resultDiv.innerHTML = 'Password updated successfully.';
                    // showToast(data.message);
                    setTimeout(() => closeModal('updatePasswordModal'), 2000);
                } else {
                    resultDiv.innerHTML = 'Error updating password.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultDiv.innerHTML = 'An error occurred while updating the password.';
            });
        });

    </script>
</body>
</html>
