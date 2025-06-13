const validator = require('validator');
const ValidateSignupData=(req)=>{
    const {firstName , lastName , emailId, password}= req.body

    if (!firstName || !emailId || !password){
        throw new Error("First name, email and password are required")
    }

    if (firstName.length <3 || firstName.length >30){
        throw new Error("First name must be between 3 and 30 characters")
    }
    if (!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    if (!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough")
    }

}
module.exports={ValidateSignupData}