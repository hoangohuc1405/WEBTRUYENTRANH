document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn gửi biểu mẫu mặc định

    // Lấy dữ liệu từ biểu mẫu
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Kiểm tra dữ liệu có hợp lệ không
    if (username && email && password) {
        // Lưu thông tin tài khoản vào localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Kiểm tra xem tài khoản đã tồn tại chưa
        const userExists = users.some(user => user.username === username || user.email === email);
        
        if (userExists) {
            alert('Tài khoản hoặc email đã tồn tại!');
        } else {
            // Thêm người dùng mới
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Đăng ký thành công!');
            window.location.href = 'login.html'; // Chuyển hướng đến trang đăng nhập
        }
    } else {
        alert('Vui lòng điền đầy đủ thông tin!');
    }
});
