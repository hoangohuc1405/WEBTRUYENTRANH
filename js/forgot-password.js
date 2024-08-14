document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.querySelector('form');
    
    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Ngăn không cho form gửi theo cách mặc định
        
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch('/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                // Xử lý khi gửi liên kết khôi phục thành công
                alert('Liên kết khôi phục đã được gửi đến email của bạn.');
                window.location.href = 'login.html'; // Chuyển hướng tới trang đăng nhập
            } else {
                // Xử lý khi gửi liên kết khôi phục thất bại
                alert(result.message || 'Gửi liên kết khôi phục thất bại');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    });
});
