const express = require('express')
const connectionRequestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const ConnectRequestModel = require('../models/connectionRequest')
const userModel = require("../models/user")

//*************************************************************************//
connectionRequestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
    // logic to send connection request
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.touserId
        const status = req.params.status

        const allowedstatus = ["ignored", "interested"]
        if (!allowedstatus.includes(status)) {
            throw new Error("invalid status type in request")
        }

        // Check if toUserId exist in DB or not We need to check in UserModel 
        const touser = await userModel.findById(toUserId)
        if (!touser) {
            return res.status(400).send({ message: "touser does not exist in DB" })
        }


        //First ->check if there is already existing request 
        // Second -> check if reciever has already recieved the request from the user so cannot send a request tho that particular user
        const existingConnectionrequest = await ConnectRequestModel.findOne({
            $or: [{ fromUserId, toUserId },                                 // first check
            { fromUserId: toUserId, toUserId: fromUserId }]                // second check [reverse to to and from]
        })

        if (existingConnectionrequest) {
            return res.status(400).send({ message: "Connection request Already exists" })
        }


        const newconnectionRequest = new ConnectRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const request = await newconnectionRequest.save()
        res.json({
            message: `connection request send ${status}`,
            request
        })

    } catch (err) {
        res.status(400).send("ERROR" + err.message)
    }

    res.send("connection request send")
})

connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user
        const status = req.params.status
        const requestId = req.params.requestId

        //status of API can be accepted/rejected
        const allowedstatus = ["accepted", "rejected"]
        if (!allowedstatus.includes(status)) {
            throw new Error("status type is not valid")
        }

        // requestid should be valid 
        const validrequestId = await ConnectRequestModel.findById(requestId)
        if (!validrequestId) {
            return res.status(400).send({ message: "request is not valid" })
        }

        //status of the request has to be interested then only can do accepted/rejected
        const requestStatus = validrequestId.status
        if (requestStatus !== "interested") {
            throw new Error("Only Interested requests can be accepted or rejected")
        }

        //touserId === loggedinuserID
        const loggedInUserId = loggedinUser._id.toString()
        const touserId = validrequestId.toUserId.toString()
        if (loggedInUserId !== touserId) {
            throw new Error("request never recieved to loggedinuser")
        }


        // const validconnectionrequest= await ConnectRequestModel.findOne({
        //     _id:requestId, 
        //     toUserId:loggedinUser._id, 
        //     status:"interested"
        // })
        // if(!validconnectionrequest){
        //     throw new Error("Connection request not found")

        // }
        // validconnectionrequest.status=status
        // const data=await validconnectionrequest.save()
        // res.json({message:"connection request"+ status})

        validrequestId.status = status
        const data = await validrequestId.save()
        res.json({ message: "Connection request " + status })



    }
    catch (err) {
        res.status(400).send("ERROR" + err.message)
    }


})

//*************************************************************************//
module.exports= connectionRequestRouter