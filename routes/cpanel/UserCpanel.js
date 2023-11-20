var express = require('express');
var router = express.Router();
var userController = require('../../components/users/UserController')
router.get('/', async (req, res, next) => {
    // hien thi trang danh sach sp
    const users = await userController.getAllUsers();
    console.log(users);
    res.render('user/list-user', { users });
});
router.get('/logout', async (req, res, next) => {

    res.render('/');
});
module.exports = router;