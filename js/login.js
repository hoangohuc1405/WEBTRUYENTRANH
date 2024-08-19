document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (usernameInput && passwordInput) {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = storedUsers.find(user => user.username === usernameInput);

            if (user && user.password === passwordInput) {
                localStorage.setItem('username', usernameInput);
                window.location.href = 'home.html';
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } else {
            alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
        }
    });
});
