const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {login, deleteUser, getAlluser, addUser, editUser, selectUserByID} = require('../helper')
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
router.post('/add', (req, res) => {
    let user = verifyToken(req.headers.token);
    console.log(req.body);
    res.send(req.body)
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
router.post('/edit', (req, res) => {
    let user = verifyToken(req.headers.token);
    const {
        ID, Name, DiaChi, Mail, Username, Password, IsAdmin, NgaySinh, SoDienThoai, GioiTinh
    } = req.body;
    if (!user.IsAdmin && user.ID !== ID) {
        res.send({
            Status: false,
            Messgae: "Bạn không có quyền để chỉnh sửa user này!"
        })
    } else {
        editUser(req.body, (data) => {
            res.send({
                Status: true,
                Messgae: "Thành công!"
            })
        })
    }
});
router.post('/delete', (req, res) => {
    let user = verifyToken(req.headers.token);
    const {
        ID, Name, DiaChi, Mail, Username, Password, IsAdmin, NgaySinh, SoDienThoai, GioiTinh
    } = req.body;
    if (!user.IsAdmin || user.ID === ID) {
        res.send({
            Status: false,
            Messgae: "Bạn không có quyền để xóa user này!"
        })
    } else {
        deleteUser(req.body, (data) => {
            res.send({
                Status: true,
                Messgae: "Thành công!"
            })
        })
    }
});


//web


router.post("/addUser", (req, res) => {
    let user = verifyToken(req.session.token);
    let type = req.body.type;
    if (type === add) {
        if (!user.IsAdmin) {
            res.send({
                Status: false,
                Message: "Không có quyền admin"
            });
        } else {
            addUser(req.body, (isAdd) => {
                if (isAdd) {
                    res.redirect('/user');
                } else {
                    res.send({
                        Status: false,
                        Message: "Username đã tồn tại,thử lại với username khác"
                    });
                }
            })
        }
    }
    else if (type === edit) {
        if (!user.IsAdmin && user.ID !== ID) {
            res.send({
                Status: false,
                Messgae: "Bạn không có quyền để chỉnh sửa user này!"
            })
        } else {
            editUser(req.body, (data) => {
                res.send({
                    Status: true,
                    Messgae: "Thành công!"
                })
            })
        }
    }
});
router.get('/get/:id', (req, res) => {
    // tra ve thong tin cho client theo id
    // cai nay get thoai mai nen can bao mat, neu k bao mat thi co the tan cong dictionary lay het user
    //phai check user lay
    let user = verifyToken(req.session.token);
    if (!user.IsAdmin) {
        res.send({
            Status: false,
            Message: "Đéo có quyền lấy",
            User: null
        })
    } else {
        let id = req.params.id;
        selectUserByID(id,(data)=>{
            res.send({
                Status: true,
                Message: "Xu ly thanh cong",
                User: data
            })
        })
    }
});

router.post("/deleteUser", (req, res) => {
    let user = verifyToken(req.session.token);
    let {ID} = req.body;
    if (!user.IsAdmin || user.ID === +ID) {
        res.send({
            Status: false,
            Message: "Bạn không có quyền để xóa user này!"
        })
    } else {
        deleteUser(req.body, (data) => {
            res.send({
                Status: true,
                Message: "Xóa ok!"
            })
        })
    }
});

module.exports = router;