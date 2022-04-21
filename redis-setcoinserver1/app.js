var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

const load_word = require('./src/module/load').load_word;

var indexRouter = require('./routes/index');
var setcoinserverRouter = require('./routes/setcoinserver');
var setcoinserverGameRouter = require('./routes/setcoinserver_game');
var setcoinserverGameResultRouter = require('./routes/setcoinserver_game_result');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

setcoinserverRouter(app);
setcoinserverGameRouter(app);
setcoinserverGameResultRouter(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

load_word(__dirname + '/data/');

module.exports = app;
