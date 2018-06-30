const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {countGhim} = require('../helper');




router.post('/countGhim', (req, res) =>{
    let user = verifyToken(req.headers.token);
    countGhim(req.body.ID, (data)=>{
       res.send(data)
    })
})


module.exports = router;