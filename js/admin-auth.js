document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');

    authForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (usernameInput && passwordInput) {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const admin = storedUsers.find(user => user.username === usernameInput);

            if (admin && admin.password === passwordInput) {
                window.location.href = 'admin.html'; // Chuyển hướng đến trang quản lý sản phẩm
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } else {
            alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
        }
    });
});
