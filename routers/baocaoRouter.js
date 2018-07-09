const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllGhim, baoCaoChiTietGhim, baoCaoTHGhim, baocaoTongHoptheoNgay} = require('../helper');
const moment = require("moment")

router.post('/getAllGhim', (req, res) =>{
    let obj = verifyToken(req.headers.token)
    getAllGhim((data) => {
        res.send(data)
    })
})

router.post('/baoCaoChiTietGhim', (req, res) =>{
    let {TuNgay, DenNgay, ID} = req.body;
    console.log(req.body)
    let user = verifyToken(req.headers.token);
    if (!user) {
        res.send("Null cmnr")
    } else {
        baoCaoChiTietGhim(TuNgay, DenNgay, ID, data => {
            console.log(data)
            res.send(data)
        })
    }
});

router.post('/baoCaoTHGhim', (req, res) =>{
    let {TuNgay, DenNgay, ID_User, ID_LoaiGhim} = req.body;
    console.log(req.body)
    let user = verifyToken(req.headers.token);
    if (!user) {
        res.send("Null cmnr")
    } else {
        baoCaoTHGhim(req.body, data => {
            res.send(data)
        })
    }
});
router.post('/baocaoththeongay', (req, res) => {
    let user = verifyToken(req.headers.token);
    if (!user) {
        res.send("Null cmnr")
    } else {
        console.log(req.body)
        baocaoTongHoptheoNgay(req.body, data => {
            res.send(data.map(i => {
                return {...i, TimeByDay: moment(i.TimeByDay).format("DD-MM-YYYY")}
            }))
        })
    }
});
module.exports = router;