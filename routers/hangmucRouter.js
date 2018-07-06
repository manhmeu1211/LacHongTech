const router = require('express').Router();
const {getToken, verifyToken, tinhGhim} = require('../utils');
const {getAllHangMuc, addWork, addGhim, deleteWork, editWork, getHangMucById, insertDoneWork} = require('../helper');
const moment = require("moment");
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
router.post('/edit', (req, res) => {
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

router.get('/done/:id', (req, res) => {
    const id = req.params.id;
    let user = verifyToken(req.headers.token);
    if (user) {
        insertDoneWork(id, user.ID, (result) => {
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
        getHangMucById(id, work => {

            let SoGhim = tinhGhim(new Date(), work.DeadLine);
            if (SoGhim > 0) {
                let obj = {
                    SoGhim,
                    IdHangMuc: work.ID,
                    LyDo: `Chậm deadline hạng mục ${work.HangMuc} Deadline: ${moment(work.DeadLine).format("DD-MM-YYYY HH:mm:ss")}, Xong: ${moment(new Date()).format("DD-MM-YYYY HH:mm:ss")}`,
                    IdUserTao: user.ID
                }
                addGhim(obj)
            }
        });
    } else {
        res.send({
            Status: false,
            Message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
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
        res.send(data[0] || {});
    })
});


module.exports = router;