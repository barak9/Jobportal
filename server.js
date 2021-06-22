require('dotenv').config()

require('./models/db3');
require('./models/db');
require('./models/db2');
const session = require("express-session")
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const auth = require("./middleware/auth");
var admin = express()
const employeeController = require('./controllers/employeeController');
const bodyParser = require('body-parser');
const cool = require('cool-ascii-faces');
const port = process.env.PORT || 3000;
var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
const TWO_HOURS = 1000*60*60
console.log(process.env.SECRET_KEY);
const {
    PORT = 3000,
    NODE_ENV="development",
    SESS_NAME= 'sid',
    SESS_SECRET="Heloo",
    SESS_LIFETIME= TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV ==="production"
app.use(session({
    name:SESS_NAME,
    resave:false,
    saveUninitialized: false,
    secret:SESS_SECRET,
    cookie:{
        maxAge:SESS_LIFETIME,
        sameSite:true,
        secure:IN_PROD
    }
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
.get('/cool', (req, res) => res.send(cool()))
app.listen(PORT, () =>console.log(`http://localhost:${PORT}`))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/', employeeController);
app.use('/list', employeeController);
app.use('/employee', employeeController);
app.use('/singlelist', employeeController);
app.use('/res', employeeController);
app.use('/resume', employeeController);
app.use('/uploads', express.static('uploads'));





