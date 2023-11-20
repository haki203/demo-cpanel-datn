const bcrypt = require('bcryptjs');
const userModel = require('./UserModel');
const login = async (email) => {
    try {
        let user = await userModel.findOne({ email: email });
        if (user) {
            // console.log(password);
            // console.log(user.password);
            // let check = bcrypt.compareSync(password, user.password);
            // return check ? user : false;
            console.log(user);
            return user;
        }
    } catch (error) {
        console.log("Login error: ", error);

    }
    return false;
}
const changepass = async (_id,new_password) => {
    console.log("truoc: ",_id, new_password);
    const salt = bcrypt.genSaltSync(4);
    const hash = bcrypt.hashSync(new_password, salt);
    let userResult = await userModel.findByIdAndUpdate(
        { _id: _id },
        {
            password: hash,
        }
    );

    console.log(userResult);
    return userResult;
}
const getAllUsers = async (size, page) => {
    // lay toan bo sp trong database
    // size =20 , page =4 ==> 61-80
    try {
        return await userModel.find();// lay category;
    } catch (error) {
        console.log("getAllUsers error: " + error);
    }
    return [];
}
const register = async (email, password, name) => {
    try {
        // ktra email co hay khong
        const user = await userModel.findOne({ email: email });
        
        console.log(user);
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newUser = { email, password: hash, name, role: 1 };
            await userModel.create(newUser);
            return true;
        }
    } catch (error) {
        console.log(error);
    }
    return false;
}
const findUser = async (email) => {
    try {
        // ktra email co hay khong
        const user = await userModel.findOne({ email: email });
        
        console.log(user);
        if (!user) {
            return null;
        }
        else{
            return user;
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = { login, register, getAllUsers, changepass,findUser };

var users = [
    { _id: 1, email: 'abc@gmail.com', password: 1, name: 'Long Vu ChiPu' },
    { _id: 2, email: 'ccc@gmail.com', password: 1, name: 'Long Vu Ngu' },
]