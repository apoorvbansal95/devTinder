const express =require('express')
const profileRouter= express.Router()
const { userAuth } = require('../middlewares/auth')
const { validateEditprofiledata } = require('../utils/validation')


//*************************************************************************//
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user
        res.status(200).send(loggedinuser)
    } catch (err) {
        res.status(400).send(err.message)
    }

})

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
       if (!validateEditprofiledata(req)){
        throw new Error("invalid updates")
       }
       const loggedinuser= req.user
       Object.keys(req.body).forEach((field)=>(loggedinuser[field]= req.body[field]))
       await loggedinuser.save();
    //    res.status(200).send("profile updated successfully")
       res.json({
        message:"profile updated", 
        data: loggedinuser
       })
        }
    catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = profileRouter