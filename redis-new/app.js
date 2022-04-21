var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var panchangeRouter = require('./routes/panchange');
var gcserverRouter = require('./routes/gcserver');
var panchangeGameRouter = require('./routes/panchange_game');
var panchangeGameDataRouter = require('./routes/panchange_game_data');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

panchangeRouter(app);
gcserverRouter(app);
panchangeGameRouter(app);
panchangeGameDataRouter(app);

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

module.exports = app;
