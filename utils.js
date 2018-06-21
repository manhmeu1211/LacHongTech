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
module.exports={
    md5,getToken,verifyToken
}
