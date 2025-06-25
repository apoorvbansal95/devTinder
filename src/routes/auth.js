const express =require('express')
const authRouter = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const { userAuth } = require('../middlewares/auth')
const { ValidateSignupData } = require('../utils/validation')

//*************************************************************************//
authRouter.post("/signup", async (req, res) => {

    try {
        console.log(req.body);

        //validate the data first
        ValidateSignupData(req)
        const { firstName, lastName, emailId, password } = req.body
        // encrypt the password
        const hashpassword = await bcrypt.hash(password, 10)
        console.log(hashpassword)


        // Create a new user instance
        const newUser = new UserModel({
            firstName,
            lastName,
            emailId,
            password: hashpassword,
        })
        await newUser.save()
        res.send("User created successfully");
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        const validuser = await UserModel.findOne({ emailId: emailId })

        if (!validuser) {
            throw new Error("No user find with this email ID")
        }

        const ispasswordcorrect = await validuser.validatePassword(password) // this method is defined in user model
        if (!ispasswordcorrect) {

            throw new Error("Wrong password entered")
        }
        // Create a JWT token 
        const token = await validuser.getJWT()  // this method is defined in user model 
        console.log(token)



        // add token to cookie and send back to user
        res.cookie("token", token)
        res.status(200).send("Login successful")

    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

authRouter.post("/logout", userAuth, async(req, res)=>{
    try{
        const loggedinuser = req.user
         res.cookie("token"), null , { expires: new Date(Date.now())}
         res.send("Logout successful")
    }catch(err){
        res.status(400).send(err.message)
    }

})
module.exports = authRouter