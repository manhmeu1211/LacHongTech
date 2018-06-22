const userRouter = require('express').Router();
const {login,addUser,getAlluser,deleteUser,updateUser} = require('../database/helper');
const {getToken,verifyToken}=require('../utils');


userRouter.post('/login', (req, res) => {
    let {username, password} = req.body;
    login(username, password, (data) => {
        if (data.length === 0) {
            res.send({status: false})
        }
        else {
            let user = data[0];
            user.status = true;
            user.Token=verifyToken(user);
            res.send(user);
        }
    })
});

userRouter.post('/addUser', (req, res) => {
    let {username, password, name, address, mail} = req.body;
    if(!username || !password || !name) {
    console.log("Err")
    }
    else {
        addUser(username, password, name, address, mail, (data) => {
            res.send(data)
        })
    }
});

userRouter.get('/getAlluser', (req, res) => {
    getAlluser( (data)=>{
        res.send(data)
    })
})

userRouter.post('/deleteUser' , (req, res) => {
    deleteUser((data) => {
        res.send(data)
    })
})

userRouter.post('/updateUser', (req, res) => {
    let {ID, username, password, name, address, mail} = req.body;
    if (!ID || !username || !password || !name ) {
        console.log("Err")
    }
    else {
        updateUser( username, password, name, address, mail, (data) => {
            res.send(data)
        })
    }
    });

module.exports = userRouter;