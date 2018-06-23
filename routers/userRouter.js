const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {login, getAlluser,addUser} = require('../helper')
router.post('/login', (req, res) => {
    let {username, password} = req.body;
    login(username, password, (data) => {
        if (data.length === 0) {
            res.send({status: false})
        }
        else {
            let user = data[0];
            user.status = true;
            user.Token = getToken(user);
            res.send(user);
        }
    })
});
router.get('/getAll', (req, res) => {
    let obj = verifyToken(req.headers.token)
    //console.log(obj)
    getAlluser((data) => {
        res.send(data)
    })
});
router.post('/addUser', (req, res) => {
    let user = verifyToken(req.headers.token);
    console.log(req.body);
    if (!user.IsAdmin) {
        res.send({
            Status: false,
            Message: "Không có quyền admin"
        });
    } else {
        addUser(req.body,(isAdd)=>{
            if(isAdd){
                res.send({
                    Status: true,
                    Message: "Thêm nhân viên thành công"
                });
            }else {
                res.send({
                    Status: false,
                    Message: "Username đã tồn tại,thử lại với username khác"
                });
            }
        })
    }
});
module.exports = router;