const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const exphbs = require('express-handlebars');
const {verifyToken, getToken} = require('./utils');
const {login} = require('./helper')
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.listen(6789, () => {
    console.log("Ok")
});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use('/api/user', require('./routers/userRouter'));
app.use('/api/duan', require('./routers/duanRouter'));

app.get('/', (req, res) => {
    let token = req.session.token;
    let user = verifyToken(token);
    if (user) {
        res.render('home')
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
            res.render("home");
            req.session.token = getToken(data[0]);
        }
    })
});
