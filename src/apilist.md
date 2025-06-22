# APIs
authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-PATCH /profile/edit
-GET /profile/view
-PATCH /profile/password

connectionrequestRouter
-POST /request/send/interested/:userid
-POST /request/send/ignored/:userid
-POST /request/review/accepted/:requestid
-POST /request/review/rejected/:requestid

userRouter
-GET /user/connections
-GET /user/requests/recieved
-GET /user/feed  

Status - ignore, interested, accepted, rejected