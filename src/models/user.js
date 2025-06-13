const mongoose = require('mongoose');

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
    about:{
        type: String
    }, 
    age:{
        type: Number,
        min: 1
    }

}, {
    timestamps: true
});

const userModel=mongoose.model('User', userSchema);
module.exports=userModel
