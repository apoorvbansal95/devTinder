const express = require('express');
const UserModel = require('./models/user')
const ConnectDB = require('./config/database')
const { ValidateSignupData } = require('./utils/validation')
const bcrypt = require('bcrypt')
const app = express()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middlewares/auth')
app.use(express.json())
app.use(cookieParser())

//*************************************************************************//
app.post("/signup", async (req, res) => {

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

app.get("/finduserwithemail", async (req, res) => {
    const emailId = req.body.emailId
    const user = await UserModel.find({ emailId: emailId })
    if (user.length === 0) {
        res.status(404).send("No user found with this email")
    }
    else {
        res.send(user)

    }

})

app.get("/findoneuserwithemail", async (req, res) => {
    const useremail = req.body.emailId

    try {
        const firstuser = await UserModel.findOne({ emailId: useremail })
        res.status(200).send(firstuser)
    }
    catch (error) {
        res.status(404).send("No user found with this email")
    }



})

app.get("/feed", async (req, res) => {
    const allusers = await UserModel.find({})
    res.send(allusers)

})

app.delete("/deleteuser", async (req, res) => {
    const userId = req.body._id
    try {

        const deletedUser = await UserModel.findByIdAndDelete({ _id: userId })
        res.status(200).send("User deleted succsesfully")
    }
    catch (err) {
        console.log(err)
    }
})

app.patch("/updateuser", async (req, res) => {
    const userId = req.body._id
    const updateddata = req.body


    try {
        const Allowed_updates = ["about", "age"]

        const isupdateallowed = Object.keys(updateddata).every((k) => {       // we will check for every data in patch request that it is present in allowed updates or not
            Allowed_updates.includes(k)                                     // i fnot return error
        })

        if (!isupdateallowed) {
            throw new Error("Invalid updates!")
        }

        console.log(updateddata)
        const updateduser = await UserModel.findByIdAndUpdate(userId, updateddata)
        res.status(200).send("User updated successfully")
    }
    catch (err) {
        console.log(err)
    }
})

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user
        res.status(200).send(loggedinuser)
    } catch (err) {
        res.status(400).send(err.message)
    }

})

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
    // logic to send connection request
    res.send("connection request send")
})
//*************************************************************************//

ConnectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}).catch((err) => {
    console.log("Database connection failed", err);
})

