const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Articles = require('./Articles/Articles');
const Users = require('./User/Users');
const session = require('express-session');
const usersController = require('./User/usersController');
const articlesController = require('./Articles/articlesController');
const port = process.env.PORT || 8080
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

connection
    .authenticate()
    .then(() => {
        console.log("Conexão estabelecida")
    })
    .catch((err) => {
        console.log("Erro" + err)
    });

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render("index");
});

app.use('/', usersController);
app.use('/', articlesController);

app.listen(port, () => {
    console.log("Server is ON")
})