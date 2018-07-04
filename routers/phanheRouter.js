const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {getAllPhanHeConfig} = require('../helper');


router.get('/getAll', (req, res) => {
    getAllPhanHeConfig(data => {
        res.send(data);
    })
});
module.exports = router;