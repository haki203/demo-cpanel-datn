//bat loi

//bat loi dang ky
const checkRegister = async (req, res, next) => {
    try{
        const {email,name, password , confirm_password} = req.body;
        if(!email || !password || !name || !confirm_password){
            return res.status(400).json({
                result: false,
                message: 'Vui long nhap day du thong tin'
            });
        }else{
            if(password.toString() != confirm_password.toString()){
                return res.status(400).json({
                    result: false,
                    message: 'Mat khau khong trung khop'
                });
            }
            next();
            // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            // if(!emailRegex.test(email)){

            // }
        }
    }catch(error){
        console.log('CHeck register error: ', error)
        return res.status
    }
}

module.exports = {checkRegister};