const express=require('express');
const UserModel=require('./models/user')
const ConnectDB=require('./config/database')
const app=express()

app.use(express.json())


 app.post("/signup", async (req, res)=>{

    console.log(req.body);

    // const userObj ={
    //     firstName:"Ram",
    //     lastName:"Singh",
    //     emailId:"rsingh@gmail.com",
    //     password:"1234@aa"

    // }

    // Create a new user instance
    const newUser= new UserModel(req.body)
     await newUser.save()
     res.send("User created successfully");
 })

ConnectDB().then(()=>{
 console.log("Database connected successfully");
 app.listen(3000 ,()=>{
    console.log('Server is running on port 3000');
})
}).catch((err)=>{
 console.log("Database connection failed", err);
})

