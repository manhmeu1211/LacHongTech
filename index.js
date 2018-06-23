const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.listen(6969,()=>{
    console.log("Ok")
})
app.use('/api/user', require('./routers/userRouter'));
