const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {addDuAn, getAllDuAn, deleteDuAn} = require('../helper')

router.post('/addDuan', (req, res) => {
    console.log(req.body)
    let user = verifyToken(req.headers.token);
    if (!user.ThemDuAn) {
        res.send({
            Status: false,
            Message: "Không có quyền thêm dự án"
        });
    }
    else {
        addDuAn(req.body, (data) => {
            res.send({
                Status: true,
                Messgae: "Thêm dự án thành công!"
            })
        })
    }
});
router.get('/getAll', (req, res) => {
    getAllDuAn(data => {
        res.send(data)
    });
});

// router.post('/deleteDuAn', (req, res) => {
//     let user = verifyToken(req.headers.token);
//     if (!user.IsAdmin) {
//         res.send({
//             Status: false,
//             Messgae: "Bạn không có quyền để xóa dự án này!"
//         })
//     }
//     else {
//         deleteDuAn(req.body, (data) => {
//             res.send({
//                 status: true,
//                 msg: "Xóa thành công"
//             })
//         })
//     }
// });

//web back-end
router.post('/add', (req, res) => {
    let user = verifyToken(req.session.token);
    if (!user.ThemDuAn) {
        res.send({
            Status: false,
            Message: "Không có quyền thêm dự án"
        });
    }
    else {
        addDuAn(req.body, (isadd) => {
            if (isadd) {
                res.redirect('/duan');
            } else {
                res.send({
                    Status: false,
                    Massage: "Dự án đã tồn tại!"
                });
            }
        })
    }
});
module.exports = router;