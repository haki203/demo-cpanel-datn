// login.js

function onClickLogin() {
    // Lấy giá trị từ hai trường input
    var email = document.getElementById('typeEmailX-2').value;
    var password = document.getElementById('typePasswordX-2').value;

    // Kiểm tra xem email và password có hợp lệ không (ví dụ đơn giản)
    if (email === '' || password === '') {
        alert('Vui lòng nhập đầy đủ email và password');
    } else {
        // Đã nhập đầy đủ, bạn có thể thực hiện các bước đăng nhập khác ở đây
        alert('Đăng nhập thành công!');
    }
}
