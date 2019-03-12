const path = require('path');
const expressHbs = require('express-handlebars');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const users = require('./routes/users');
const cart = require('./routes/cart');
const account = require('./routes/account');
const config = require('config');

if(config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/api/users',users);
app.use('/',auth);
app.use('/api/cart',cart);


app.use('/personal', account);
//app.use('/', userRoute);
app.use(express.static(path.join(__dirname+'../views')));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');
//app.set('views',path.join(__dirname, 'views'));
//app.use(cookieParser());



app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});



mongoose.connect('mongodb://localhost/joi', function(err,db){
    if(err) throw err;
    console.log('connected to mongodb');
});

const port = process.env.PORT || 4000;
app.listen(port,function(){
    console.log('listening on port '+port+'...');
});