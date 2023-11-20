var express = require('express');
var router = express.Router();
const userController = require('../components/users/UserController');
const jwt = require('jsonwebtoken');
const auth = require('../middle/Authen');
/* trang chu */
router.get('/', [auth.authenweb], function (req, res, next) {
  res.render('index');
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
  const { email } = req.body;
  const result = await userController.login(email);
  //luu tt vao token
  console.log("result (index login):",result);
  if (result) {
    const token = jwt.sign({ _id: result._id,role:result.role }, 'secret');
    req.session.token = token;
    return res.redirect('/');
  }
  else {
    return res.redirect('/login');
  }
});
router.get("/logout", [auth.authenweb], function (req, res, next) {
  req.session.destroy();
  res.redirect('/login');
});
module.exports = router;
