const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.listen(6789, () => {
    console.log("Ok")
})
app.use('/api/user', require('./routers/userRouter'));
app.use('/api/duan', require('./routers/duanRouter'));
