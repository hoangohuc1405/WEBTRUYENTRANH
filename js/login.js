document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Kiểm tra thông tin đăng nhập (thay thế bằng kiểm tra thực tế)
        if (username && password) {
            // Lưu tên người dùng vào localStorage
            localStorage.setItem('username', username);
            // Chuyển hướng đến trang chính
            window.location.href = 'index.html';
        } else {
            alert("Vui lòng nhập tên đăng nhập và mật khẩu.");
        }
    });
});
