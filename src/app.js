const express = require('express');
const ConnectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser())

const authRouter= require('./routes/auth')
const profileRouter = require('./routes/profile')
const connectionRequestRouter = require('./routes/connectionRequest')

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRequestRouter)

//*************************************************************************//
//*************************************************************************//

ConnectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}).catch((err) => {
    console.log("Database connection failed", err);
})

