const express =require('express')
const connectionRequestRouter= express.Router()
const { userAuth } = require('../middlewares/auth')

//*************************************************************************//
connectionRequestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    // logic to send connection request
    res.send("connection request send")
})

module.exports= connectionRequestRouter