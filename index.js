const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const exphbs = require('express-handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.listen(6789, () => {
    console.log("Ok")
});
app.use('/api/user', require('./routers/userRouter'));
app.use('/api/duan', require('./routers/duanRouter'));


app.get('/', (req, res) => {
    res.render('home')
});