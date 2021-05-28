const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());


app.use(express.static('public'));
//template engin handlebars
app.engine('hbs', handlebars({extname: '.hbs'})); //SET handlebar extension.......hbs instead of html
app.set('view engine', 'hbs');

const pool = mysql.createPool({
    connectionLimit: 100, // maximum number to create the connection at once to db
    host: 'localhost',
    user: 'root',
    password: 'password',
    database:'usermanagement'
});

pool.getConnection((err, connection)=>{
    if(err){
        console.log('Connection Error: '+ err);
    }
    console.log('DB Connected with ID..'+connection.threadId)
})

// user is a routing 
const routes = require('./server/routes/user');
app.use('/', routes);


app.listen(port, console.log('Server Listening on: ', port));