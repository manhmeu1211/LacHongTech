let crypto = require('crypto');
const SHAKEY = "hihihaha%$%!#@!";
const jwt = require('jsonwebtoken');
const http = require("https");
let md5 = data => {
    return crypto.createHash('md5').update(data).digest("hex");
};

let verifyToken = (token) => {
    try {
        return jwt.verify(token, SHAKEY);
    } catch (ex) {
        return null
    }
};
let getToken = (data) => {
    return jwt.sign({...data}, SHAKEY, {expiresIn: '24h'});
};

function tinhGhim(ngayhoanthanh, deadline) {
    let cout = 0;
    while (ngayhoanthanh - deadline > 0) {
        let minute = ngayhoanthanh.getHours() * 60 + ngayhoanthanh.getMinutes();
        if (ngayhoanthanh.getDay() === 0) {
            ngayhoanthanh.setHours(ngayhoanthanh.getHours() - 4);
            continue;
        } else if (ngayhoanthanh.getDay() === 6) {
            if (minute >= (8 * 60) && minute < (12 * 60)) {
                cout++;
            }
        } else {
            if (minute >= (13 * 60 + 30) && minute < (17 * 60 + 30)) {
                cout++;
            } else if (minute >= (8 * 60) && minute <= (12 * 60)) {
                cout++;
            }
        }
        ngayhoanthanh.setHours(ngayhoanthanh.getHours() - 4);
    }
    return cout;
}
module.exports={
    md5, getToken, verifyToken, tinhGhim
}
