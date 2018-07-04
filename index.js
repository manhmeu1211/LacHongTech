const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const exphbs = require('express-handlebars');
const {verifyToken, getToken} = require('./utils');
const {login, getAlluser, getAllDuAn, getAllHangMuc} = require('./helper')
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.listen(6788, () => console.log("Chạy ngay đi trc khi mọi điều tồi tệ hơn ~~~~~~~~"));
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
    getAllHangMuc(id,data => {
        res.render('congviec')
    });
});