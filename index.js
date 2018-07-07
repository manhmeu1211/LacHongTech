const express = require('express');
const path = require('path');
const multer = require('multer');
const moment = require("moment")
const xlsx = require('node-xlsx');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const exphbs = require('express-handlebars');
const {verifyToken, getToken} = require('./utils');
const {login, getAlluser, getAllDuAn, getAllHangMuc, queryDataBase, addWork} = require('./helper/index')
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.listen(6788, () => console.log("Chạy ngay đi trc khi mọi điều tồi tệ hơn ~~~~~~~~"));
let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.originalname.split('.')[0] + '-' + moment().format("DD-MM-YYYYTHH-mm-ss") + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

let upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(function (req, res, next) {
    req.headers['if-none-match'] = '';
    req.headers['if-modified-since'] = '';
    if (!req.session.token && req.url !== '/' && req.url.indexOf(".") === -1 && req.url.indexOf("/api/") === -1 && req.url.indexOf("/login") === -1) {
        res.redirect(307, '/')
    } else {
        next();
    }
});

app.use('/api/user', require('./routers/userRouter'));
app.use('/api/duan', require('./routers/duanRouter'));
app.use('/api/work', require('./routers/hangmucRouter'));
app.use('/api/trangthai', require('./routers/trangthaiRouter'));
app.use('/api/phanhe', require('./routers/phanheRouter'));
app.use('/api/ghim', require('./routers/ghimRouter'));
app.use('/api/baocao', require('./routers/baocaoRouter'))


app.get('/', (req, res) => {
    let token = req.session.token;
    let user = verifyToken(token);
    if (user) {
        res.render('home');
    } else {
        res.render('login', {layout: false});
    }
});
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    login(username, password, (data) => {
        console.log(data)
        if (data.length === 0) {
            res.render("login", {layout: false, username})
        } else {
            getAlluser(data => {
                res.redirect('/user')

            });
            req.session.token = getToken(data[0]);
        }
    })
});
app.get('/user', (req, res) => {
    getAlluser(data => {
        res.render('user')
    });
});
app.get('/baocao', (req, res) => {
    res.render('baocao')
});
app.get('/duan', (req, res) => {
    getAllDuAn(data => {
        res.render('duan')
    });
});
app.get('/work', (req, res) => {
    const id = req.query.id;
    getAllHangMuc(id, data => {
        res.render('congviec')
    });
});
app.get('/uploadExcel', (req, res) => {
    res.render("uploadExcel")
})
app.post('/uploadExcelDuAn', upload, function (req, res, next) {
    console.log(req.file)
    let {data} = xlsx.parse(`${__dirname}/uploads/${req.file.filename}`)[0];
    data.shift();
    let users = data.map(item => item[13]);
    let users2 = data.map(item => item[14]);
    users.push(...users2);
    let s = [...(new Set(users))].filter(item => item);
    let str = s.map(item => `('${item}','${item}','c4ca4238a0b923820dcc509a6f75849b')`)
    queryDataBase(`insert into UserV2 (Name,Username,Password) values ${str}`)
    let userOBJ = {
        hoang: 3097,
        DUNGVA: 3098,
        BAOVIET: 3099,
        BAOVIETMINHND: 3100,
        'Bảo Việt': 3101,
        LIENNH: 3102,
        QUANGHM: 3103,
        THANGND: 3104,
        SONTQ: 3105,
        TUNGHS: 3106,
        DUONGTT: 3107,
        MINHBQ: 3108,
        NGANT: 3109,
        DUCTV: 3110,
        TRUONGNM: 3111,
        HAOHT: 3112,
        VUONGTM: 3113
    };
    let phanhe = {
        Desktop: 1,
        Server: 2,
        'Tổng đài': 3,
        Store: 4,
        Service: 5,
        service: 6,
        web: 7,
        server: 8
    };
    data.forEach(item => {
        let work = {
            HangMuc: item[2]
            , PhanHe: phanhe[item[4]]
            , MoTa: item[3]
            , NgayBatDau: moment(getDateFromTimeStamp(item[6])).format("YYYY-MM-DĐ")
            , Deadline: getDateFromTimeStamp(item[7], item[8])
            , Status: 1,
            NguoiYeuCau: userOBJ[item[13]],
            NguoiThucHien: userOBJ[item[14]],
            TenDuAn: 1013
        }
        addWork(work,()=>{})
    });
    res.send(users2)
});

function getDateFromTimeStamp(time, option) {
    let date = new Date(1899, 12, time - 1);
    if (option) {
        if (option.indexOf("12") !== -1) {
            date.setHours(12);
            date.setSeconds(0);
            date.setMinutes(0);
        } else {
            date.setHours(17);
            date.setSeconds(30);
            date.setMinutes(0);
        }
    }
    return date;

}