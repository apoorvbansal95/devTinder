const express =require('express')
const profileRouter= express.Router()
const { userAuth } = require('../middlewares/auth')


//*************************************************************************//
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user
        res.status(200).send(loggedinuser)
    } catch (err) {
        res.status(400).send(err.message)
    }

})

module.exports = profileRouter