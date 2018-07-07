const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllGhim, baoCaoChiTietGhim} = require('../helper');

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
        baoCaoChiTietGhim(moment(Start).format("DD-MM-YYYY HH:mm:ss"), moment(End).format("DD-MM-YYYY HH:mm:ss"), data => {
            res.send(data)
        })
    }
});

router.post('/baoCaoTHGhim', (req, res) =>{
    let {baocao} = req.body;
    console.log(req.body)
    let user = verifyToken(req.headers.token);
    if (!user) {
        res.send("Null cmnr")
    } else {
        baoCaoTHGhim(moment(Start).format("DD-MM-YYYY HH:mm:ss"), moment(End).format("DD-MM-YYYY HH:mm:ss"), data => {
            res.send(data)
        })
    }
});


module.exports = router;