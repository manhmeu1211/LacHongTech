const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {login, getAlluser, addUser,editUser} = require('../helper')
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
        addUser(req.body, (isAdd) => {
            if (isAdd) {
                res.send({
                    Status: true,
                    Message: "Thêm nhân viên thành công"
                });
            } else {
                res.send({
                    Status: false,
                    Message: "Username đã tồn tại,thử lại với username khác"
                });
            }
        })
    }
});
router.post('/editUser', (req, res) => {
    let user = verifyToken(req.headers.token);
    const {
        ID, Name, DiaChi, Mail, Username, Password, IsAdmin, NgaySinh, SoDienThoai, GioiTinh
    } = req.body;
    console.log(req.body);
    if (!user.IsAdmin && user.ID !== ID) {
        res.send({
            Status: false,
            Messgae: "Bạn không có quyền để chỉnh sửa user này!"
        })
    }else {
        editUser(req.body,(data)=>{
            res.send({
                Status: true,
                Messgae: "Thành công!"
            })
        })
    }

});
module.exports = router;