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
        }).populate("fromUserId", ["firstName", "lastName", "age", "about", "photo"])    // populate using ref

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
                { fromUserId: loggedinuser._id, status: "accepted" },
            ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "about", "photo"]).populate("toUserId", ["firstName", "lastName", "age", "about", "photo"])  // populate using ref

        const data = acceptedconnectionsRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedinuser._id.toString()) {
                return row.toUserId
            }
            else {
                return row.fromUserId
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {

        //avoid cards for user A
        // -> his own card
        // -> his friends/connections [accepted]
        //-> his ignored cards [ he rejected]
        // -> people he send connection requests to  ---> // people who rejected him

        const loggedinuser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit =limit>50?50:limit
        const skip = (page - 1) * limit                                 // feed?page=2&limit=10    =>11-20
        console.log(skip)                                           // feed?page=3&limit=10    =>21-30
                                                                     // feed?page=4&limit=10    =>31-40
        // find all connection requests for which A is from or to 
        const allconnectionrequests = await ConnectRequestModel.find({
            $or: [{ toUserId: loggedinuser._id }, { fromUserId: loggedinuser._id }]
        }).select("fromUserId toUserId")

        const hideUsers = new Set()
        allconnectionrequests.map((req) => {
            hideUsers.add(req.fromUserId.toString())
            hideUsers.add(req.toUserId.toString())
        })
        console.log(hideUsers)
        const feedusers = await userModel.find({
            $and: [{ _id: { $nin: Array.from(hideUsers) } }, { _id: { $ne: loggedinuser._id } }]
        }).select("firstName lastName age gender about photo skills").skip(skip).limit(limit)
        res.send(feedusers)
    }
    catch (err) {
        res.status(400).send(err)
    }
})
//*************************************************************************//

module.exports=userRouter