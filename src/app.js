const express=require('express');

const app=express()



app.get("/user/", (req, res, next)=>{
    console.log(req.params)
    next()

}, (req, res,next)=>{
    console.log("2nd route")
    res.send("this is the second route");
})
app.use("/test", (req, res)=>{
    res.send("HEllo from  test server")
})
app.listen(3000 ,()=>{
    console.log('Server is running on port 3000');
})