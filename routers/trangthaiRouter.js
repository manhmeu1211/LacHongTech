const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllTrangThaiCongViecConfig} = require('../helper');
router.get('/getAll', (req, res) => {
    getAllTrangThaiCongViecConfig(data => {
        res.send(data);
    })
});
module.exports = router;