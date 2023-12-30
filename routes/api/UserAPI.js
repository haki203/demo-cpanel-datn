var express = require('express');
var router = express.Router();
const userController = require('../../components/users/UserController');
const validation = require('../../middle/Validation');
const jwt = require('jsonwebtoken');
const userModel = require('../../components/users/UserModel');
const cors = require('cors');
const app = express();
const { authenApp } = require('../../middle/Authen');
const AdminModel = require('../../components/users/AdminModel');
const { log } = require('debug/src/browser');
const PaymentModel = require('../../components/products/PaymentModel');
//api login
// r
// Kiểm tra email và trả về user hoặc tạo mới user
router.get('/login-google/:email', async (req, res) => {
    try {
        const { email } = req.params;
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let user = await userModel.findOne({ email });
        if (!user) {
            // Nếu email chưa tồn tại, tạo mới user với email và các trường khác là null
            user = await userModel.create({ email });
        }
        res.status(200).json({ result: true, user: user });
    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
router.get('/payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let user = await userModel.findByIdAndUpdate(id, { premium: true });
        if (user) {
            res.status(200).json({ result: true, user: user });
        }
        else {
            res.status(200).json({ result: false, message: "khong co user" });
        }
    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
router.get('/get-all/user', async (req, res) => {
    try {
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let users = await userModel.find({})
        if (users) {
            res.status(200).json({ result: true, users: users.length });
        }
        else {
            res.status(200).json({ result: false, message: "khong co user" });
        }
    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
const moment = require('moment');

router.post('/doanhthu/new', async (req, res) => {
    try {
        const { userId, money } = req.body;
        const time = moment().add(7, 'hours').format('hh:mm A');
        const date = moment().add(7, 'hours').format('DD/MM/YYYY');
        const body = { userId: userId, date: date, time: time, money: money }
        if (!userId || !money) {
            res.status(200).json({ result: false, message: "thieu thong tin" });

        } else {
            const get = await PaymentModel.find({ userId: userId })
            console.log(get);
            if (get.length>0) {
                const newP = await PaymentModel.findOneAndUpdate({userId:userId},{money:get[0].money+money})
                // Kiểm tra xem email đã tồn tại trong MongoDB chưa
                if (newP) {
                    res.status(200).json({ result: true, newP: newP, message: "update" });
                }
                else {
                    res.status(200).json({ result: false, message: "khong co user" });
                }
            } else {
                const newP = await PaymentModel.create(body);
                // Kiểm tra xem email đã tồn tại trong MongoDB chưa
                if (newP) {
                    res.status(200).json({ result: true, newP: newP ,message: "new" });
                }
                else {
                    res.status(200).json({ result: false, message: "khong co user" });
                }
            }
        }

    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});

router.post('/banUser', async (req, res, next) => {
    try {
        const { id, ban } = req.body;
        if (!id) {
            return res.status(402).json({ result: false });
        }
        if (ban == null) {
            return res.status(403).json({ result: false, message: "Chua co ban" });
        }
        else {
            const getUser = await userModel.find({});
            const user = await userModel.findByIdAndUpdate(getUser[id]._id, { ban: ban });
            if (!user) {
                return res.status(200).json({ result: false });
            }
            else {
                return res.status(200).json({ result: true, user });
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: false });
    }
});
router.get('/delete-premium/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let user = await userModel.findByIdAndUpdate(id, { premium: false });
        if (user) {
            res.status(200).json({ result: true, user: user });
        }
        else {
            res.status(200).json({ result: false, message: "khong co user" });
        }
    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
function generateRandomId() {
    // Tạo mảng chứa tất cả các ký tự chữ cái
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    // Chọn ngẫu nhiên một ký tự từ mảng chữ cái
    const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    
    // Tạo một số ngẫu nhiên từ 1000 đến 9999
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    // Kết hợp ký tự và số để tạo ID
    const generatedId = randomChar + randomNum;
    
    return generatedId;
  }
router.post('/login', async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email })
        console.log(email);
        console.log(user);
        if (user) {
            // tao token
            const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });
            return res.status(200).json({ result: true, user: user, token: token, status: true, message: 'Login successful', });
        }
        else {
            const id="user-"+generateRandomId();
            const avt='https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK';
            const role=1;
            const phone="Chưa có";
            const bodyNew={full_name:id,email:email,avatar:avt,role:1,phone:phone,ban:false,premium:false};
            console.log(id);
            const userNew = await userModel.create(bodyNew);
            const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });

            return res.status(200).json({ result: true, message: "Create new user succesfully",user:userNew,token:token,status:true });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ result: false });
    }
});
//login cpanel
router.post('/login/cpanel', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(201).json({ result: false, message: "Thieu thong tin" });
        }
        else {
            const user = await AdminModel.findOne({ email });
            console.log(user);
            console.log("pass ne: ", password);
            console.log("pass ne: ", user.password);

            if (password == user.password) {
                const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });
                res.status(200).json({ result: true, user: user, token: token });
            } else {
                res.status(201).json({ status: true, message: 'Login failer' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ result: false });
    }
});
router.post('/update-user', async (req, res, next) => {
    try {
        const { id, name, email, phone, avatar } = req.body;
        if (!id || !name || !email || !phone || !avatar) {
            return res.status(201).json({ result: false, message: "thieu thong tin" });
        }
        try {
            const user = await userModel.findByIdAndUpdate(id, { full_name: name, email: email, avatar: avatar, phone: phone });
            console.log(user);
            if (user) {
                return res.status(200).json({ result: true, user: user, });
            }
            else {
                return res.status(201).json({ result: false, message: "ko cap nhat duoc user" });
            }
        } catch (error) {
            return res.status(201).json({ result: false, message: error });
        }

    } catch (error) {
        console.log(error);
        res.status(201).json({ result: false, message: error });
    }
});
router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy;
        let data = {
            logout: true,
            responeTimestamp: new Date(),
            statusCode: 200,

        }
        res.status(200).json({ result: true, data });

    } catch (error) {
        console.log(error);
        res.status(201).json({ result: false });
    }
});
//api register
// api/user/register
router.post('/register', [validation.checkRegister], async (req, res, next) => {
    try {

        const { email, password, name } = req.body;
        const result = await userController.register(email, password, name);
        let data = {
            error: false,
            responeTimestamp: new Date(),
            statusCode: 200,
            result,
        }
        if (result == true) {
            return res.status(200).json({ result: true, data });
        }
        else {
            return res.status(201).json({ result: false, data });
        }
    } catch (error) {
        console.log(error);
        //next error; Chi chay web
        return res.status(201).json({ result: false });
    }
});
router.post('/changepass/', async (req, res, next) => {
    try {
        const { _id, new_password } = req.body;
        console.log("API truoc: ", _id, new_password);
        const kq = await userController.changepass(_id, new_password);
        let data = {
            error: false,
            responeTimestamp: new Date(),
            statusCode: 200,
            kq,
        }
        if (kq == null) {
            return res.status(201).json({ result: false, messenger: "doi mat khau ko thanh cong" });
        }
        else {
            return res.status(200).json({ result: true, data, messenger: "doi mat khau thanh cong" });
        }



    } catch (error) {
        console.log(error);
        //next error; Chi chay web
        return res.status(201).json({ result: false, messenger: "Ko doi duoc mat khau" });
    }
});
router.get('/findUser/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (user == null) {
            return res.status(200).json({ result: false });
        }
        else {
            return res.status(200).json({ result: true, user });
        }
    } catch (error) {
        console.log(error);
        //next error; Chi chay web
        return res.status(201).json({ result: false });
    }
});



// api gui mail
// api/user/sendmail
router.post('/sendmail', async (req, res, next) => {
    try {
        let { email, subject } = req.body;
        let content = subject;
        subject = "Book App"
        const send = await userController.sendMail(email, subject, content);
        return res.status(200).json({ send, result: true });

    } catch (error) {
        console.log("sendmail error", error);
        return res.status(500).json({ result: false });
    }
})
module.exports = router;