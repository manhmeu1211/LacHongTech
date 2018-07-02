const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllHangMuc, insertDoneWork, addWork, deleteWork, editWork, getHangMucById} = require('../helper');
router.post('/add', (req, res) => {
    let user = verifyToken(req.headers.token);
    console.log(req.body);
    let {body} = req;
    if (!user.ThemDuAn) {
        res.send({
            Status: false,
            Message: "Không có quyền thêm công việc"
        });
    }
    else {
        addWork(req.body, (isadd) => {
            if (isadd) {
                res.send({
                    Status: true,
                    Message: "Thêm thành công"
                })
            }
            else {
                res.send({
                    Status: false,
                    Message: "Thêm không thành công"
                })
            }
        })
    }
});

router.post('/delete', (req, res) => {
    let user = verifyToken(req.headers.token);
    if (!user.IsAdmin) {
        res.send({
            Status: false,
            Message: "Không có quyền"
        })
    }
    else {
        deleteWork(req.body.ID, (data) => {
            if (data) {
                res.send({
                    Status: true,
                    Message: "Xóa thành công"
                })
            }
            else {
                res.send({
                    Status: false,
                    Message: "Xóa không thành công"
                })
            }
        })
    }
})
router.post('/edit',  (req, res) => {
    let user = verifyToken(req.headers.token);
    console.log(req.body)
    if (!user.IsAdmin) {
        res.send({
            Status: false,
            Message: "Không có quyền"
        })
    }
    else {
        editWork(req.body, (data) => {
            if (data) {
                res.send({
                    Status: true,
                    Message: "Sửa thành công"
                })
            }
            else {
                res.send({
                    Status: false,
                    Message: "Sửa không thành công"
                })
            }
        })
    }
});



router.get('/getAll/:id', (req, res) => {
    const id = req.params.id;
    getAllHangMuc(id, data => {
        res.send(data);
    })
});
router.get('/done/:id', (req, res) => {
    const id = req.params.id;
    let user = verifyToken(req.headers.token);
    if (user) {
        insertDoneWork(id, user.ID, (result) => {
            console.log(result);
            if (result) {
                res.send({
                    Status: true,
                    Message: "Xử lý thành công"
                })
            } else {
                res.send({
                    Status: false,
                    Message: "Bạn không có quyền báo xong hạng mục này!"
                })
            }
        })
    } else {
        res.send({
            Status: false,
            Message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
        })
    }
});


router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    let user = verifyToken(req.headers.token);
    if (user) {
        getHangMucById(id, data => {
            res.send(data[0] || {});
        })
    }

});


module.exports = router;