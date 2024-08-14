<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .response {
            padding: 10px;
            margin-bottom: 10px;
            text-align: center;
            font-weight: bold;
            border-radius: 5px;
            display: none;
        }
        .response.success {
            background-color: #d4edda;
            color: #155724;
        }
        .response.error {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
    <script>
        function showResponse(message, type) {
            const responseDiv = document.createElement('div');
            responseDiv.className = `response ${type}`;
            responseDiv.innerText = message;

            // Insert the response div before the form's 'Don't have an account?' section
            const formSection = document.querySelector('.form-section');
            formSection.insertBefore(responseDiv, formSection.querySelector('p'));

            responseDiv.style.display = 'block';

            // Remove the response div after 5 seconds
            setTimeout(() => {
                responseDiv.remove();
            }, 5000);
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Handle the response from the PHP script
            const urlParams = new URLSearchParams(window.location.search);
            const response = urlParams.get('response');
            if (response) {
                const data = JSON.parse(decodeURIComponent(response));
                showResponse(data.message, data.status);
                if (data.status === 'success') {
                    setTimeout(() => {
                        window.location.href = 'recharge.html';
                    }, 2000); // Redirect after 2 seconds
                }
            }
        });
        
        
    </script>
</head>
<body>
    <div class="container">
        <div class="image-section">
            <img src="./sprites/rummy_anim/rummy_anim_59.png" alt="Rummy">
        </div>
        <div class="form-section">
            <form action="login.php" method="post" id="login-form">
                <h1>Login</h1>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Login</button>
            </form>
            <p style="color: white; margin-top:30px;">Don't have an account? <a style="color: rgb(212, 158, 22); font-weight: 900" href="register_html.php">Register here</a></p>
        </div>
    </div>
    <!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/66b90616146b7af4a439161a/1i51bvj1t';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->

    <script>
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);

            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Update the URL with the response
                const params = new URLSearchParams({ response: JSON.stringify(data) });
                window.location.search = params.toString();
            })
            .catch(error => {
                showResponse('An unexpected error occurred. Please try again later.', 'error');
            });
        });
    </script>
</body>
</html>
