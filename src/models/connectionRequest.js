const mongoose = require('mongoose');

//*************************************************************************//
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{Value} is not correct status`,
        },
        required: true
    }
}, {
    timestamps: true
})
//*************************************************************************//

connectionRequestSchema.index({fromUserId: 1 , toUserId: 1})



// connectionRequestSchema.pre("save", function(){
//     const connectrequest=this

//     // check if fromuser === touser
//     if(connectrequest.fromUserId.equals(connectrequest.toUserId)){
//         throw new Error("Cannot send request to itself")
//     }
//     next()
// })

const ConnectRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectRequestModel