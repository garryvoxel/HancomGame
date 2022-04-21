var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var ejsLocals = require('ejs-locals');
var moment = require('moment');
var cors = require('cors');

var upload = require('express-fileupload');
var csvtojson = require('csvtojson');
//var ResponseCode = require(__dirname + '/classes/response_code');

var indexRouter = require('./routes/index');
var vueBridgeRouter = require('./routes/express_vue_bridge');
var deveoperTestRouter = require('./routes/test_api');

var app = express();

app.use(cors());

// view engine setup
app.engine('ejs', ejsLocals);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: '!@#$Hancom Backoffice$#@!',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:1000*60*60} // 1 hour
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(upload());

app.use('/', indexRouter);
app.use('/', vueBridgeRouter);
app.use('/', deveoperTestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' || req.app.get('env') === 'test' ? err : {};
  if(req.app.get('env') === 'development' || req.app.get('env') === 'test') console.log("Error.message:::" + err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// for vue_framework
app.use(require('connect-history-api-fallback')());

module.exports = app;
