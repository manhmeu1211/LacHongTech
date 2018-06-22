const express = require('express')
const bodyParser = require('body-parser')
let app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(1211,()=>{
    console.log("Port 1211 của Mạnh đẹp trai")
});
app.use('/user', require('./routers/userRouter'));
app.use('/user', require('./routers/commentRouter'));