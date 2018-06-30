const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllHangMuc, addWork, deleteWork,editWork,getHangMucById} = require('../helper');
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

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    getHangMucById(id, data => {
        res.send(data[0]||{});
    })
});


module.exports = router;