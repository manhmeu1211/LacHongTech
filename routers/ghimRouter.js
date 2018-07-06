const router = require('express').Router();
const {getToken, verifyToken} = require('../utils');
const {countGhim, selectGhimBetweenTwoDate} = require('../helper');


router.post('/countGhim', (req, res) => {
    let user = verifyToken(req.headers.token);
    countGhim(req.body.ID, (data) => {
        res.send(data)
    })
})
router.post("/ghimhoiha", (req, res) => {
    let {Start, End} = req.body;
    console.log(req.body)
    let user = verifyToken(req.headers.token);
    if (user) {
        res.send("Null cmnr")
    } else {
        selectGhimBetweenTwoDate(Start, End, data => {
            res.send(data)
        })
    }

});


module.exports = router;