const express = require('express');
const app = express();
const routes = require('./routes/index.js');
const port = process.env.PORT || 8080;
const flash = require('connect-flash');
const expressMsg = require('express-messages');
const expressValidator = require('express-validator');

const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const passport = require('passport');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds015879.mlab.com:15879/fccpoll')

app.set('view engine', 'ejs');

app.use(morgan('dev')); 
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

app.use(passport.initialize()); 
app.use(passport.session()); 

app.use(flash());
app.use(function(req, res, next){
  console.log()
  res.locals.messages = expressMsg(req, res);
  if(req.user){
    res.locals.user = req.user.username;
  }else{
    res.locals.user = null;
  }
  next();
})

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/models', express.static(process.cwd() + '/models'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/views', express.static(process.cwd() + '/views'));

routes(app, passport);

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});