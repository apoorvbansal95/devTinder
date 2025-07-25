const jwt = require('jsonwebtoken')
const userModel = require('../models/user')


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if(!token){
            return res.status(401).send("You are not logged in")
        }

        const decodedobj = await jwt.verify(token, "DEV@Tinder987")
        const { _id } = decodedobj

        const validuser = await userModel.findById(_id)

        if (!validuser) {
            throw new Error("No user foudn with this ID")
        }
        req.user=validuser
        next()
    }
    catch (err) {
        res.status(400).send({ message: err.message })
    }
}
module.exports = {
    userAuth
}