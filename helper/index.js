const pool = require('./pool');
const sql = require('mssql');
const {md5} = require('../utils');

function login(username, password, callback) {
    password = md5(password);
    pool.request()
        .input('password', sql.VarChar(150), password)
        .input('username', sql.VarChar(50), username)
        .execute('usp_User_HaoHt_selectUser')
        .then(result => {
            callback(result.recordset);
        }).catch(err => {
        console.log(err)
    })
}

function getAlluser(callback) {
    pool.request().execute('usp_User_ManhMeu_selectAllUser')
        .then(result => {
            callback(result.recordsets[0]);
        }).catch(err => {
        console.log(err)
    })
}

function addUser(user, callback) {
    let {Username, Password, Name, DiaChi, Mail, IsAdmin, NgaySinh, GioiTinh, SoDienThoai} = user;
    Password = md5(Password);
    pool.request()
        .input('Username', sql.VarChar(150), Username)
        .input('PassWord', sql.VarChar(150), Password)
        .input('Name', sql.NVarChar(250), Name)
        .input('Diachi', sql.NVarChar(200), DiaChi)
        .input('mail', sql.VarChar(200), Mail)
        .input('Gioitinh', sql.Bit, GioiTinh)
        .input('NgaySinh', sql.Date, NgaySinh)
        .input('isAdmin', sql.Bit, IsAdmin)
        .input('sdt', sql.VarChar(20), SoDienThoai)
        .execute('usp_User_bach_Insert')
        .then(result => {
            const {kq}=result.recordset[0]
            callback(kq)
        }).catch(err => {
    })
}
function editUser(user, callback) {
    let {Username, Password, Name, DiaChi, Mail, IsAdmin, NgaySinh, GioiTinh, SoDienThoai,ID} = user;
    Password = md5(Password);
    pool.request()
        .input('Username', sql.VarChar(150), Username)
        .input('ID', sql.Int, ID)
        .input('PassWord', sql.VarChar(150), Password)
        .input('Name', sql.NVarChar(250), Name)
        .input('Diachi', sql.NVarChar(200), DiaChi)
        .input('mail', sql.VarChar(200), Mail)
        .input('Gioitinh', sql.Bit, GioiTinh)
        .input('NgaySinh', sql.Date, NgaySinh)
        .input('isAdmin', sql.Bit, IsAdmin)
        .input('sdt', sql.VarChar(20), SoDienThoai)
        .execute('usp_User_bach_Insert')
        .then(result => {

            callback(true)
        }).catch(err => {
    })
}


module.exports = {
    login, getAlluser, addUser,editUser
}