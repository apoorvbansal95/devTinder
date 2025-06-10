const express=require('express');
const UserModel=require('./models/user')
const ConnectDB=require('./config/database')
const app=express()

app.use(express.json())


app.post("/signup", async (req, res) => {

    console.log(req.body);
    // Create a new user instance
    const newUser = new UserModel(req.body)
    await newUser.save()
    res.send("User created successfully");
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

app.get("/findoneuserwithemail", async(req, res)=>{
    const useremail=req.body.emailId
    
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

ConnectDB().then(()=>{
 console.log("Database connected successfully");
 app.listen(3000 ,()=>{
    console.log('Server is running on port 3000');
})
}).catch((err)=>{
 console.log("Database connection failed", err);
})

