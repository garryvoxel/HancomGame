var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs')

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
	fs.readFile("./dist/index.html", "utf-8", (err, content) => {
		if (err) {
			console.log('We cannot open "./dist/index.html" file.')
		}

		res.writeHead(200, {
			"Content-Type": "text/html; charset=utf-8"
		})

		res.end(content)
	})
})

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
