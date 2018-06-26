const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {addDuAn} = require('../helper')

router.post('/addDuan', (req, res) => {
    console.log(req.body)
    let user = verifyToken(req.headers.token);
    if(!user.ThemDuan){
        res.send({
            Status: false,
            Message: "Không có quyền thêm dự án"
        });
    }
    else {
       addDuAn(req.body, (data)=>{
           res.send({
               Status: true,
               Messgae: "Thêm dự án thành công!"
           })
       })
    }
});

module.exports = router;