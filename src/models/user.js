const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//*************************************************************************//
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        minLength: 8
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender not valid")
            }
        }
    },
    about: {
        type: String
    },
    age: {
        type: Number,
        min: 1
    }

}, {
    timestamps: true
});


//*************************************************************************//
userSchema.methods.getJWT = async function () {
    const validuser = this
    const token = await jwt.sign({ _id: validuser._id }, "DEV@Tinder987", { expiresIn: "1d" })
    return token
}

userSchema.methods.validatePassword = async function (passwordinputbyuser) {
    const validuser = this
    const ispasswordvalid = await bcrypt.compare(passwordinputbyuser, validuser.password)
    return ispasswordvalid
}


//*************************************************************************//
const userModel = mongoose.model('User', userSchema);
module.exports = userModel
