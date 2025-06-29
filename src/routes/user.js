const express=require('express')
const userRouter= express.Router()
const { userAuth } = require('../middlewares/auth')
const userModel = require("../models/user")
const ConnectRequestModel = require('../models/connectionRequest')


//*************************************************************************//
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {

        const loggedinuser = req.user

        // find all my incoming requests which will be only interested ones. 
        const incomingconnectionsRequest = await ConnectRequestModel.find({
            toUserId: loggedinuser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "about"])    // populate using ref

        res.json({
            message: "Data fetch succesfully",
            data: incomingconnectionsRequest
        })

    }
    catch (err) {
        res.status(400).send(err)
    }
})

userRouter.get("/user/requests/friends", userAuth, async (req, res) => {
    try {

        const loggedinuser = req.user

        // find all my accepted requests by me or someone I send 
        const acceptedconnectionsRequest = await ConnectRequestModel.find({
            $or: [
                { toUserId: loggedinuser._id, status: "accepted" },
                { fromUserIdUserId: loggedinuser._id, status: "accepted" },
            ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "about"]).populate("fromUserId", ["firstName", "lastName", "age", "about"])  // populate using ref

        const data = acceptedconnectionsRequest.map((row) => 
            {if (row.fromUserId._id.toString()===loggedinuser._id.toString()){
                return row.toUserId
            }
            else{
               return  row.fromUserId
            }
                })
        res.json({
            message: "Data fetch succesfully",
            data: data
        })

    }
    catch (err) {
        res.status(400).send(err)
    }
})

//*************************************************************************//

module.exports=userRouter