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
    let {Username, Password, Name, DiaChi, Mail, IsAdmin, NgaySinh, GioiTinh, SoDienThoai, ThemDuAn} = user;
    Password = md5(Password);
    pool.request()
        .input('Username', sql.VarChar(150), Username)
        .input('PassWord', sql.VarChar(150), Password)
        .input('ThemDuAn', sql.Bit, ThemDuAn)
        .input('Name', sql.NVarChar(250), Name)
        .input('Diachi', sql.NVarChar(200), DiaChi)
        .input('mail', sql.VarChar(200), Mail)
        .input('Gioitinh', sql.Bit, GioiTinh)
        .input('NgaySinh', sql.Date, NgaySinh)
        .input('isAdmin', sql.Bit, IsAdmin)
        .input('sdt', sql.VarChar(20), SoDienThoai)
        .execute('usp_User_bach_Insert')
        .then(result => {
            const {kq} = result.recordset[0]
            callback(kq)
        }).catch(err => {
    })
}

function editUser(user, callback) {
    let {Username, Password, Name, DiaChi, Mail, IsAdmin, NgaySinh, GioiTinh, SoDienThoai, ID, ThemDuAn} = user;
    pool.request()
        .input('Username', sql.VarChar(150), Username)
        .input('ID', sql.Int, ID)
        .input('PassWord', sql.VarChar(150), null)
        .input('ThemDuAn', sql.Bit, ThemDuAn)
        .input('Name', sql.NVarChar(250), Name)
        .input('Diachi', sql.NVarChar(200), DiaChi)
        .input('mail', sql.VarChar(200), Mail)
        .input('Gioitinh', sql.Bit, GioiTinh)
        .input('NgaySinh', sql.Date, NgaySinh)
        .input('isAdmin', sql.Bit, IsAdmin)
        .input('sdt', sql.VarChar(20), SoDienThoai)
        .execute('usp_User_Bach_UpdateUser')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err)
    })
}

function deleteUser(user, callback) {
    let {ID} = user;
    pool.request()
        .input('ID', sql.Int, ID)
        .execute('usp_User_Bach_Delete')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err)
    })
}

function addDuAn(duan, callback) {
    let {TenDuAn} = duan;
    pool.request()
        .input('Name', sql.NVarChar(100), TenDuAn)
        .execute('usp_DuAn_Bach_Insert')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function getAllDuAn(callback) {
    pool.request()
        .execute('usp_DuAn_Bach_Select')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function getAllHangMuc(id, callback) {
    pool.request()
        .input('ID', sql.Int, id)
        .execute('usp_Work_Bach_selectByIDDuAn')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function getHangMucById(id, callback) {
    pool.request()
        .input('ID', sql.Int, id)
        .execute('usp_Work_Bach_Select')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function getAllTrangThaiCongViecConfig(callback) {
    pool.request()
        .execute('usp_TrangThaiCongViec_Bach_selectTrangThaiCongViec')
        .then(result => {
            callback(result.recordset);
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function getAllPhanHeConfig(callback) {
    pool.request()
        .execute('usp_PhanHe_Bach_selectAll')
        .then(result => {
            callback(result.recordset);
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}


function deleteDuAn(duan, callback) {
    let {ID} = duan;
    pool.request()
        .input('ID', sql.Int, ID)
        .execute('usp_Work_Bach_Delete')
        .then(result => {
            callback(true)
        }).catch(err => {
        callback(false)
    })
}

function addWork(work, callback) {
    let {Hangmuc, Phanhe, Mota, Ngaybatdau, Deadline, Status, Nguoiyeucau, Nguoithuchien, TenDuAn} = work;
    pool.request()
        .input('Hangmuc', sql.NVarChar(50), Hangmuc)
        .input('Phanhe', sql.NVarChar(50), Phanhe)
        .input('Mota', sql.NVarChar(1000), Mota)
        .input('Ngaybatdau', sql.Date, Ngaybatdau)
        .input('Deadline', sql.Date, Deadline)
        .input('Trangthai', sql.Int, Status)
        .input('Nguoiyeucau', sql.NVarChar(150), Nguoiyeucau)
        .input('Nguoithuchien', sql.NVarChar(150), Nguoithuchien)
        .input('IdDuAn', sql.Int, +TenDuAn)
        .execute('usp_Work_bach_InsertWork')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function deleteWork(ID, callback) {
    pool.request()
        .input('ID', sql.Int, +ID)
        .execute('usp_Work_Bach_Delete')
        .then(result => {
            callback(true)
        }).catch(err => {
        callback(false)
    })
}

function editWork(work, callback) {
    let {ID,Hangmuc, Phanhe, Mota, Ngaybatdau, Deadline, Status, Nguoiyeucau, Nguoithuchien, TenDuAn} = work;
    pool.request()
        .input('Hangmuc', sql.NVarChar(50), Hangmuc)
        .input('ID', sql.Int, ID)
        .input('Phanhe', sql.NVarChar(50), Phanhe)
        .input('Mota', sql.NVarChar(1000), Mota)
        .input('Ngaybatdau', sql.Date, Ngaybatdau)
        .input('Deadline', sql.Date, Deadline)
        .input('Trangthai', sql.Int, Status)
        .input('Nguoiyeucau', sql.NVarChar(150), Nguoiyeucau)
        .input('Nguoithuchien', sql.NVarChar(150), Nguoithuchien)
        .input('IdDuAn', sql.Int, +TenDuAn)
        .execute('usp_Work_Bach_UpdateWork')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function countGhim(ID, callback){
    pool.request()
        .input('ID', sql.Int, +ID)
        .execute('usp_Bach_Ghim')
        .then(result =>{
            callback(result.recordset)
        }).catch(err =>{
            console.log('Lỗi')
    })
}

module.exports = {
    login,
    getAlluser,
    addUser,
    editUser,
    deleteUser,
    addDuAn,
    getAllDuAn,
    deleteDuAn,
    getAllHangMuc,
    getAllTrangThaiCongViecConfig,
    getAllPhanHeConfig,
    addWork,
    deleteWork,
    editWork,
    getHangMucById,
    countGhim
}