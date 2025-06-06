const mongoose=require('mongoose')

const connectDB =async()=>{
    await mongoose.connect("mongodb+srv://apoorv95ab:MrF5pqXxc6jxPCLH@namestenode.jeu49cg.mongodb.net/devTinder")
}

module.exports=connectDB;