//process.env.NODE_ENV = 'test';
//////////////////////////////////////////////////////////////////////
// 공용 타입
global.TYPE = require('./common/type');
global.TIME = require('./common/time');
global.APP_ROOT = require('path').dirname(require.main.filename) + '/../';
//////////////////////////////////////////////////////////////////////

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var jade = require('jade');
var favicon = require('serve-favicon');
const setcoin = require('./routes/setcoin2');
const panchange = require('./routes/panchange');

const sdk_game = require('./routes/sdk_game');

const mole = require('./routes/mole'); // kevin added
const game = require('./routes/game');

const game2 = require('./routes/game2'); // dev version

const typing_practice = require('./routes/typing_practice');
const web2 = require('./routes/web2');
const log = require('./routes/log'); // kevin added

const rank = require('./routes/rank'); //cha added
const clan = require('./routes/clan'); //cha added
const point = require('./routes/point'); //cha added

const cors = require('cors');
let cacheProvider = require('./common/cache-provider');
let globalArray = require('./common/global_array');
const event_ended = require('./common/schedule_todo');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
console.log("진입점 ====================================== 1");
var app = express();

app.use(cors());
app.options('*', cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

console.log("진입점 ====================================== 2");

app.use('/', indexRouter);
app.use('/game/setcoin', setcoin);
app.use('/game/panchange', panchange);
app.use('/game/mole', mole); // kevin added
app.use('/game/typing_practice', typing_practice);
app.use('/game/web2', web2);
app.use('/game/log', log); // kevin added 

app.use('/game/sdk/v1', sdk_game);

app.use('/game/', game);
app.use('/game/rank', rank); // cha added
app.use('/game/clan', clan); // cha added
app.use('/game/point', point); // cha added

// 2019-02-13 (Chase Lee): 웹서비스용 API 추가
app.set('webConfig', require('./config/web.config.json')[process.env.NODE_ENV || 'development'])
app.use('/game/web/v1', require('./routes/web'));


// dev version
app.use('/game2/setcoin', setcoin);
app.use('/game2/panchange', panchange);
app.use('/game2/mole', mole);
app.use('/game2/typing_practice', typing_practice);
app.use('/game2/web2', web2);
app.use('/game2/log', log); 

app.use('/game2/sdk/v1', sdk_game);

app.use('/game2/', game2);
app.use('/game2/rank', rank); // cha added
app.use('/game2/clan', clan); // cha added
app.use('/game2/point', point); // cha added

app.use('/game2/web/v1', require('./routes/web'));
// end dev version

console.log("진입점 ====================================== 3");
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
    console.error(err);
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

cacheProvider.start(function(err) {
    if (err) console.error(err);
});

globalArray.start(function(err) {
    if (err) console.error(err);
})

const cron = require('node-cron');
console.log("진입점 ====================================== 4");

//지난 이벤트를 END 처리 위해 스케쥴러를 돌립니다. (3시간마다 1회)
cron.schedule('* */100 * * *', function() {
    console.log('TO CHECK ABOUT EVENTS END TIME / ' + new Date());
    event_ended.event_to_end();
}).start();


module.exports = app;