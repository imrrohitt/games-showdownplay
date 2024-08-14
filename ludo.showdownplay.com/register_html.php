<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" href="styles.css">
    <script>
        function validateForm() {
            const password = document.getElementById('password').value;
            const dob = document.getElementById('dob').value;

            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return false;
            }

            if (!document.getElementById('full_name').value.trim()) {
                alert('Full Name is required.');
                return false;
            }

            if (!dob) {
                alert('Date of Birth is required.');
                return false;
            }

            return true;
        }

        async function handleRegister(event) {
            event.preventDefault();
            if (!validateForm()) return;

            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch('register.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.innerHTML = data.message ? `<p class="success">${data.message}</p>` : '';
                messageDiv.innerHTML += data.error ? `<p class="error">${data.error}</p>` : '';

                if (data.username) {
                    const usernameDiv = document.getElementById('username');
                    usernameDiv.innerHTML = `<p>Generated Username: <span id="username-text">${data.username}</span> <button class="copy-btn" onclick="copyUsername()">Copy</button></p>`;
                }
                
                form.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function copyUsername() {
            const usernameText = document.getElementById('username-text').innerText;
            navigator.clipboard.writeText(usernameText).then(() => {
                alert('Username copied to clipboard!');
            });
        }
    </script>
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
</head>
<body>
    <div class="container">
        <div class="image-section">
            <img src="https://images.unsplash.com/photo-1642056448488-906d3511fe96?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Ludo">
        </div>
        <div class="form-section">
            <form onsubmit="handleRegister(event)" novalidate>
                <h1>Register to Play Ludo</h1>
                <label for="full_name">Full Name: <span style="color: red;">*</span></label>
                <input type="text" id="full_name" name="full_name" required>
                <br>
                <label for="mobile">Mobile Number:</label>
                <input type="text" id="mobile" name="mobile">
                <br>
                <label for="dob">Date of Birth: <span style="color: red;">*</span></label>
                <input type="date" id="dob" name="dob" required>
                <br>
                <label for="password">Password: <span style="color: red;">*</span></label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Register</button>
            </form>
            <div id="message"></div>
            <div id="username"></div>
            <p >Already have an account? <a style="color: rgb(212, 158, 22); font-weight: 900" href="login_html.php">Login here</a></p>
        </div>
    </div>
</body>
</html>