const pool =require('./pool');
const sql=require('mssql')

function login(username,password,callback){
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

function addUser(username,password,name, address, mail, callback){
    pool.request()
    .input('Username', sql.VarChar(150), username)
    .input('PassWord', sql.VarChar(150), password)
    .input('Name', sql.VarChar(150), name)
    .input('Diachi', sql.VarChar(200), address)
    .input('mail', sql.VarChar(200), mail)
    .execute('usp_User_bach_Insert')
    .then(result => {
        callback(true);
    }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function getAlluser(callback){
    pool.request().execute('usp_User_ManhMeu_selectAllUser')
        .then(result => {
            callback(result);
        }).catch(err => {
            console.log(err)
    })
}

function deleteUser(ID, callback){
    pool.request()
        .input('ID', sql.Int , ID)
        .execute('usp_User_Bach_Delete')
        .then(result => {
            callback(true);
        }).catch(err => {
            console.log(err)
            callback(false)
    })
}

function updateUser(ID, name, address, username, password, mail, callback){
    pool.request()
        .input('ID', sql.Int, ID)
        .input('Username', sql.VarChar(150), username)
        .input('PassWord', sql.VarChar(150), password)
        .input('Name', sql.VarChar(150), name)
        .input('Diachi', sql.VarChar(200), address)
        .input('mail', sql.VarChar(200), mail)
        .execute('usp_User_Bach_UpdateUser')
        .then(result => {
            callback(true);
        }).catch(err => {
            console.log(err)
            callback(false);
    })
}


function addComments(Comment, callback){
    pool.request()
        .input('Comment', sql.VarChar(250), Comment)
        .execute('usp_Comment_bach_Insert')
        .then(result => {
            callback(true);
        }).catch(err => {
        console.log(err)
        callback(false)
    })
}

function removeComments(callback){
    pool.request()
        .execute('usp_User_Bach_removeComments')
        .then(result => {
            callback(result.recordset);
        }).catch(err => {
        console.log(err)
    })
}


module.exports={
    login,addUser, getAlluser, deleteUser, addComments,updateUser,removeComments
}


