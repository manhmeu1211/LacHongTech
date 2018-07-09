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
        .input('ThemDuAn', sql.Bit, ThemDuAn || false)
        .input('Name', sql.NVarChar(250), Name)
        .input('Diachi', sql.NVarChar(200), DiaChi)
        .input('mail', sql.VarChar(200), Mail)
        .input('Gioitinh', sql.Bit, GioiTinh)
        .input('NgaySinh', sql.Date, NgaySinh)
        .input('isAdmin', sql.Bit, IsAdmin || false)
        .input('sdt', sql.VarChar(20), SoDienThoai)
        .execute('usp_User_bach_Insert')
        .then(result => {
            const {kq} = result.recordset[0]
            callback(kq)
        }).catch(err => {
    })
}

function editUser(user, callback) {
    let {Name, DiaChi, Mail, IsAdmin, NgaySinh, GioiTinh, SoDienThoai, ID, ThemDuAn, Username} = user;
    pool.request()
        .input('ID', sql.Int, ID)
        .input('ThemDuAn', sql.Bit, ThemDuAn)
        .input('Name', sql.NVarChar(250), Name)
        .input('Username', sql.NVarChar(250), Username)
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

function updatePass(user, callback) {
    let {ID, PassNew, PassOld} = user;
    PassNew = md5(PassNew);
    PassOld = md5(PassOld);
    pool.request()
        .input('Id', sql.Int, ID)
        .input('PasswordNew', sql.VarChar(50), PassNew)
        .input('PasswordOld', sql.VarChar(50), PassOld)
        .execute('usp_User_Bach_Updatepassword')
        .then(result => {
            callback(result.recordset[0].kq)
        }).catch(err =>{
            callback(false)
        console.log(err)
    })
}

function addDuAn(duan, callback) {
    let {TenDuAn, NgayTao} = duan;
    pool.request()
        .input('tenDuAn', sql.NVarChar(100), TenDuAn)
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
        .execute('usp_Work_Bach_selectByIDDuAnV2')
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
            callback(result.recordset[0])
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
    let {HangMuc, PhanHe, MoTa, NgayBatDau, Deadline, Status, NguoiYeuCau, NguoiThucHien, TenDuAn} = work;
    pool.request()
        .input('Hangmuc', sql.NVarChar(50), HangMuc)
        .input('Phanhe', sql.NVarChar(50), PhanHe)
        .input('Mota', sql.NVarChar(1000), MoTa)
        .input('Ngaybatdau', sql.Date, NgayBatDau)
        .input('Deadline', sql.Date, Deadline)
        .input('Trangthai', sql.Int, Status)
        .input('Nguoiyeucau', sql.NVarChar(150), NguoiYeuCau)
        .input('Nguoithuchien', sql.NVarChar(150), NguoiThucHien)
        .input('IdDuAn', sql.Int, +TenDuAn)
        .execute('usp_Work_bach_InsertWork')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err);
        callback(false);
    })
}

function addGhim(obj, callback = () => {
}) {
    let {IdHangMuc, LyDo, SoGhim, IdUserTao, Loai} = obj;
    pool.request()
        .input('Id_User', sql.Int, IdUserTao)
        .input('Id_Work', sql.Int, IdHangMuc)
        .input('SoGhim', sql.Int, SoGhim)
        .input('LyDo', sql.NVarChar(250), LyDo)
        .input('Loai', sql.Int, Loai)
        .execute('usp_Ghim_ManhMeu_Insert')
        .then(result => {
            callback(true)
        }).catch(err => {
        console.log(err);
        callback(false);
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

function insertDoneWork(ID, IdUser, callback) {
    pool.request()
        .input('ID', sql.Int, +ID)
        .input('IdUser', sql.Int, +IdUser)
        .execute('usp_DuAn_Bach_InsertDoneWork')
        .then(result => {
            console.log(result.recordset[0])
            callback(result.recordset[0].result)
        }).catch(err => {
        callback(false)
    })
}

function baoLoiWork(obj, callback) {
    let {SoLoi, MoTa, Deadline, ID, IdUser} = obj
    pool.request()
        .input('Id_User', sql.Int, IdUser)
        .input('Id_Work', sql.Int, ID)
        .input('SoLoi', sql.Int, SoLoi)
        .input('MoTa', sql.NVarChar(250), MoTa)
        .input('Deadline', sql.NVarChar(250), Deadline)
        .execute('usp_BaoLoi_ManhMeu_Insert')
        .then(result => {
            console.log("đmdm", result.recordset[0])
            callback(result.recordset[0].kq)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function editWork(work, callback) {
    let {ID, HangMuc, PhanHe, MoTa, NgayBatDau, Deadline, Status, NguoiYeuCau, NguoiThucHien, TenDuAn, IdDuAn} = work;
    pool.request()
        .input('Hangmuc', sql.NVarChar(50), HangMuc)
        .input('ID', sql.Int, ID)
        .input('Phanhe', sql.NVarChar(50), PhanHe)
        .input('Mota', sql.NVarChar(1000), MoTa)
        .input('Ngaybatdau', sql.Date, NgayBatDau)
        .input('Deadline', sql.Date, Deadline)
        .input('Status', sql.Int, Status)
        .input('Nguoiyeucau', sql.NVarChar(150), NguoiYeuCau)
        .input('Nguoithuchien', sql.NVarChar(150), NguoiThucHien)
        .input('IdDuAn', sql.Int, +IdDuAn)
        .execute('usp_Work_Bach_UpdateWork')
        .then(result => {
            console.log(result)
            callback(true)
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function selectGhimBetweenTwoDate(start = new Date(), end = new Date(), callback) {
    pool.request()
        .input('start', sql.NVarChar(250), start)
        .input('end', sql.NVarChar(250), end)
        .execute('usp_Ghim_Bach_SelectGhimAllUser')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log('Lỗi', err)

    })
}

function countGhim(ID, callback) {
    pool.request()
        .input('ID', sql.Int, +ID)
        .execute('usp_Bach_Ghim')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log('Lỗi')
    })
}

function getAllGhim(callback) {
    pool.request()
        .execute('usp_LoaiGhim_Select')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log('lỗi', err)
    })
}

function baoCaoChiTietGhim(TuNgay = new Date(), DenNgay = new Date(), ID, callback) {
    pool.request()
        .input('TuNgay', sql.NVarChar(250), TuNgay)
        .input('DenNgay', sql.NVarChar(250), DenNgay)
        .input('IDUser', sql.Int, +ID)
        .execute('usp_BaoCaoChiTietGhim')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log('Lỗi', err)
    })
}

function baoCaoTHGhim(baocao, callback) {
    let {TuNgay, DenNgay, ID, IDLoaiGhim} = baocao;
    pool.request()
        .input('TuNgay', sql.NVarChar(250), TuNgay)
        .input('DenNgay', sql.NVarChar(250), DenNgay)
        .input('IDUser', sql.Int, +ID)
        .input('LoaiGhim', sql.Int, +IDLoaiGhim)
        .execute('usp_BaoCaoTongHopGhim')
        .then(result => {
            callback(result.recordset)
        }).catch(err => {
        console.log('Lỗi', err)
    })
}

function baocaoTongHoptheoNgay(baocao, callback) {
    let {Start, End} = baocao;
    pool.request()
        .input('TuNgay', sql.NVarChar(250), Start)
        .input('DenNgay', sql.NVarChar(250), End)
        .execute('usp_BieuDo_TongHopGhimTheoNgay')
        .then(result => {
            console.log(result.recordset)
            callback(result.recordset)
        }).catch(err => {
        console.log('Lỗi', err)
    })
}


function selectWorkByIdNotOk(id, callback) {
    pool.request()
        .input('ID', sql.Int, id)
        .execute('usp_Work_Bach_SelectNotOk')
        .then(result => {
            callback(result.recordset[0])
        }).catch(err => {
        console.log('Lỗi', err)
    })
}

function selectUserByID(ID, callback) {

    pool.request()
        .input('ID', sql.Int, +ID)
        .execute('usp_User_Bach_selectByID')
        .then(result => {
            callback(result.recordset[0])
        }).catch(err => {
        console.log('Lỗi')
    })
}

function queryDataBase(query, callback) {
    pool.request().query(query, function (error, results, fields) {
        if (error) throw error;
        if (callback)
            callback(results);
        // console.log(results)
    });
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
    countGhim,
    insertDoneWork,
    selectUserByID,
    addGhim,
    baoLoiWork,
    selectWorkByIdNotOk,
    queryDataBase,
    selectGhimBetweenTwoDate,
    getAllGhim,
    baoCaoChiTietGhim,
    updatePass,
    baoCaoTHGhim,
    baocaoTongHoptheoNgay
}