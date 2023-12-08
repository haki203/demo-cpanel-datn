var express = require('express');
var router = express.Router();
const userController = require('../components/users/UserController');
const jwt = require('jsonwebtoken');
const auth = require('../middle/Authen');
/* trang chu */
router.get('/', function (req, res, next) {
    try {
        // Đường dẫn đến file bạn muốn tải xuống
        const filePath = 'https://drive.google.com/file/d/1j2_LwpzfuE4k-GLE6pZBqyJmbdIf9POr/view';

        // Tên file mà người dùng sẽ nhìn thấy khi tải xuống
        const fileName = 'athens-release.apk';  // Đặt tên mà bạn muốn hiển thị

        // Tải xuống file
        res.redirect(filePath);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error downloading file:', error);
        // Gửi mã lỗi 500 Internal Server Error cho người dùng
        res.status(500).send('Internal Server Error');
    }
});


// trang login
router.get('/login', [auth.authenweb], function (req, res, next) {
    // hien thi trnag login
    res.render('user/login');
});
// trang form
router.get('/form', [auth.authenweb], function (req, res, next) {
    // hien thi trnag login
    res.render('user/form');
});
router.get('/tables', [auth.authenweb], function (req, res, next) {
    // hien thi trnag login
    res.render('user/tables');
});
router.post('/login', [auth.authenweb], async function (req, res, next) {
    // ktra xu ly login
    // neu thanh cong => trang chu
    const { email, password } = req.body;
    const result = await userController.login(email, password);
    //luu tt vao token
    console.log("result (index login):", result);
    if (result) {
        const token = jwt.sign({ _id: result._id, role: result.role }, 'secret');
        req.session.token = token;
        return res.redirect('/');
    }
    else {
        return res.redirect('/login?error=invalid');
    }
});
router.get("/logout", [auth.authenweb], function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});
module.exports = router;
