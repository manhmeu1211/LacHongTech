const router = require('express').Router();
const {getToken, verifyToken, tinhGhim} = require('../utils');
const {getAllHangMuc, addWork, addGhim, selectWorkByIdNotOk, baoLoiWork, deleteWork, editWork, getHangMucById, insertDoneWork} = require('../helper');
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
        const obj = {...body, NguoiYeuCau: user.ID}
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
    let statusNotOk = 4;
    let user = verifyToken(req.headers.token);
    if (!user.IsAdmin) {
        res.send({
            Status: false,
            Message: "Không có quyền"
        })
    } else if (+req.body.Status === 4) {
        res.send({
            Status: false,
            Message: "Không được sửa not ok, vui lòng sử dụng chức năng báo lỗi"
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
router.post('/baoloi', (req, res) => {
    console.log(req.body);
    let obj = req.body;
    let user = verifyToken(req.headers.token);
    if (user && user.ThemDuAn) {
        obj.IdUser = user.ID;
        baoLoiWork(obj, (data) => {
            if (data) {

                res.send({
                    Status: true,
                    Message: "Báo lỗi thành công"
                })
            } else {
                res.send({
                    Status: false,
                    Message: "Không thể báo cáo trạng thái hạng mục chưa hoàn thành"
                })
            }
        })
    } else {
        res.send({
            Status: false,
            Message: "Bạn không có quyền thêm dự án hoặc báo lỗi"
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
                getHangMucById(id, work => {
                    if (work.Status === 4) {

                        selectWorkByIdNotOk(id, data => {
                            let SoGhim = tinhGhim(new Date(), data.DeadLine);
                            if (SoGhim > 0) {
                                let obj = {
                                    SoGhim,
                                    IdHangMuc: work.ID,
                                    LyDo: `Not Ok hạng mục ${work.HangMuc} Deadline: ${moment(data.DeadLine).format("DD-MM-YYYY HH:mm:ss")}, Xong: ${moment(new Date()).format("DD-MM-YYYY HH:mm:ss")}`,
                                    IdUserTao: user.ID,
                                    Loai: 2
                                };
                                addGhim(obj);
                            }
                        });
                    } else {
                        let SoGhim = tinhGhim(new Date(), work.DeadLine);
                        if (SoGhim > 0) {
                            let obj = {
                                SoGhim,
                                IdHangMuc: work.ID,
                                LyDo: `Chậm deadline hạng mục ${work.HangMuc} Deadline: ${moment(work.DeadLine).format("DD-MM-YYYY HH:mm:ss")}, Xong: ${moment(new Date()).format("DD-MM-YYYY HH:mm:ss")}`,
                                IdUserTao: user.ID,
                                Loai: 1
                            };
                            addGhim(obj);
                        }
                    }
                });
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

router.get('/getAll/:id', (req, res) => {
    const id = req.params.id;
    getAllHangMuc(id, data => {
        console.log(data)
        res.send(data);
    })
});

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    getHangMucById(id, data => {
        res.send(data[0] || data || {});
    })
});

router.post("/addWork", (req, res) => {
    let user = verifyToken(req.session.token);
    let type = req.body.type;
    if (type === 'add') {
        if (!user.ThemDuAN) {
            res.send({
                Status: false,
                Message: "Không có quyền thêm dự án"
            });
        } else {
            addWork(req.body, (isAdd) => {
                if (isAdd) {
                    res.send({
                        Status: True,
                        Message: "Thêm thành công"
                    })
                } else {
                    res.send({
                        Status: false,
                        Message: "Công việc đã tồn tại!"
                    });
                }
            })
        }
    }
    else if (type === 'edit') {
        if (!user.ThemDuAN) {
            res.send({
                Status: false,
                Messgae: "Bạn không có quyền để chỉnh sửa công việc này!"
            })
        } else {
            editWork(req.body, (data) => {
                res.send({
                    Status: True,
                    Message: "sửa thành công"
                })
            })
        }
    }
});

router.get('/gethangmuc/:id', (req, res) => {
    let user = verifyToken(req.session.token);
    if (!user.ThemDuAN) {
        res.send({
            Status: false,
            Message: "Không có quyền lấy",
            Work: null
        })
    } else {
        let id = req.params.id;
        getHangMucById(id,(data)=>{
            res.send({
                Status: true,
                Message: "Xu ly thanh cong",
                Work: data
            })
        })
    }
});

router.post("/deleteWork", (req, res) => {
    let user = verifyToken(req.session.token);
    let {ID} = req.body;
    if (!user.ThemDuAn) {
        res.send({
            Status: false,
            Message: "Bạn không có quyền để xóa công việc này!"
        })
    } else {
        deleteWork(req.body, (data) => {
            res.send({
                Status: true,
                Message: "Xóa ok!"
            })
        })
    }
});

module.exports = router;