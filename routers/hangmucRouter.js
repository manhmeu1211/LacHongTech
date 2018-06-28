const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllHangMuc} = require('../helper');
router.post('/add',(req,res)=>{
    let {body}=req;
    res.send(body);
});
router.get('/getAll/:id',(req,res)=>{
    const id=req.params.id;
    getAllHangMuc(id,data=>{
        res.send(data);
    })
});

module.exports = router;