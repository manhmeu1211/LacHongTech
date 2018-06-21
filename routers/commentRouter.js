const commentRouter = require('express').Router();
const {addComments,removeComments} = require('../database/helper');
const {getToken,verifyToken}=require('../utils');

commentRouter.post('/addComments', (req, res) => {
    let {Comment} = req.body;
    if (!Comment) {
        console.log("Err")
    }
    else {
        addComments(Comment, (data) => {
            res.send(data)
        })
    }
});

commentRouter.post('/removeComments', (req, res) => {
    removeComments((data) => {
        res.send(data)
    })
})
module.exports = commentRouter;
