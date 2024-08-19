document.addEventListener('DOMContentLoaded', () => {
    const signinButton = document.getElementById('signin-button');
    const dropdownMenu = document.createElement('div'); // Tạo một phần tử dropdown menu mới
    const loggedInUser = localStorage.getItem('username');

    dropdownMenu.classList.add('dropdown-menu'); // Thêm lớp CSS cho menu
    dropdownMenu.innerHTML = `
        <a href="#" class="dropdown-item">Người dùng</a>
        <a href="admin-auth.html" class="dropdown-item">Người quản lý</a>
        <a href="#" class="dropdown-item" id="logout">Đăng xuất</a>
    `;

    if (loggedInUser) {
        signinButton.innerHTML = ` ${loggedInUser}`;
        signinButton.appendChild(dropdownMenu); // Thêm dropdown menu vào nút

        signinButton.addEventListener('mouseover', () => {
            dropdownMenu.style.display = 'block'; // Hiển thị menu khi hover
        });

        signinButton.addEventListener('mouseout', (event) => {
            // Đảm bảo rằng dropdown menu vẫn hiển thị nếu hover vào menu
            if (!dropdownMenu.contains(event.relatedTarget)) {
                dropdownMenu.style.display = 'none';
            }
        });

        // Xử lý sự kiện Đăng xuất
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('username');
                localStorage.removeItem('isAdmin'); // Xóa trạng thái admin
                signinButton.innerHTML = 'Sign In'; // Cập nhật nút
                dropdownMenu.style.display = 'none'; // Ẩn menu sau khi đăng xuất
            });
        }
    } else {
        signinButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Đóng menu dropdown khi click ra ngoài
    document.addEventListener('click', (event) => {
        if (!signinButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
});
