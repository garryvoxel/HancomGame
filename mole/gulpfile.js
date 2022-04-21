var gulp = require('gulp');
//var uglify = require('gulp-uglify');
var javascriptObfuscator = require('gulp-javascript-obfuscator');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
// build dist path
var destPath = 'public/mole';
var envType = '';

// js 파일 난독화
gulp.task('uglify', function() {
  return gulp.src([
    'WebContent/**/*.js',
    '!WebContent/lib/*.js'
  ])
  // .pipe(uglify({mangle:{toplevel:true}})) // 난독화 수준 높임
  .pipe(gulp.dest(destPath + '/WebContent')) // 결과 dist 폴더에 저장
  .pipe(browserSync.reload({stream:true})); //browserSync 로 브라우저에 반영
});

// js 파일 난독화 - javascript-obfuscator
function obfuscator() {
  return gulp.src([
    'WebContent/**/*.js',
    '!WebContent/lib/*.js'
  ])
  .pipe(javascriptObfuscator({disableConsoleOutput: true}))
  .pipe(gulp.dest(destPath + '/WebContent')) // 결과 dist 폴더에 저장
};

// js 파일 copy - dev용
function copyJs() {
  return gulp.src([
    'WebContent/**/*.js',
    '!WebContent/lib/*.js'
  ])
  .pipe(gulp.dest(destPath + '/WebContent'))
};

function copy() {
  return gulp.src('index.js')
  .pipe(gulp.dest(destPath));
};

function copyLib() {
  return gulp.src([
    'WebContent/lib/*.*',
  ])
  .pipe(gulp.dest(destPath + '/WebContent/lib'));
};

function copyWebContent() {
  return gulp.src([
    'WebContent/index.html',
    'WebContent/favicon.ico'
  ])
  .pipe(gulp.dest(destPath + '/WebContent'));
};

function copyAssets() {
  return gulp.src([
    'WebContent/assets/**/*.json',
    'WebContent/assets/**/*.mp3',
    'WebContent/assets/**/*.png',
    'WebContent/assets/**/*.xml',
  ])
  .pipe(gulp.dest(destPath + '/WebContent/assets'));
};

// 파일 변경 감지
gulp.task('watch', function() {
  gulp.watch('WebContent/**/*.js');
})

//dist 폴더를 기준으로 웹서버 실행
gulp.task('server', gulp.series('uglify'), function () {
  return browserSync.init({
      server: {
          baseDir: './' + destPath
      }
  });
});

function setEnvTst() {
  envType = "test";
  return gulp.src('./config/env.tst.js')
  .pipe(rename(function (path) {
    path.basename = "env";
  }))
  .pipe(gulp.dest(destPath+'/WebContent/assets/config'));
}

function setEnvDev() {
  envType = "development";
  return gulp.src('./config/env.dev.js')
  .pipe(rename(function (path) {
    path.basename = "env";
  }))
  .pipe(gulp.dest(destPath+'/WebContent/assets/config'));
}

function setEnvStg() {
  envType = "stage";
  return gulp.src('./config/env.stg.js')
  .pipe(javascriptObfuscator({disableConsoleOutput: true}))
  .pipe(rename(function (path) {
    path.basename = "env";
  }))
  .pipe(gulp.dest(destPath+'/WebContent/assets/config'));
}

function setEnvPrd() {
  envType = "production";
  return gulp.src('./config/env.prd.js')
  .pipe(javascriptObfuscator({disableConsoleOutput: true}))
  .pipe(rename(function (path) {
    path.basename = "env";
  }))
  .pipe(gulp.dest(destPath+'/WebContent/assets/config'));
}

function copyConf() {
  return gulp.src('./config/config.js')
  .pipe(gulp.dest(destPath+'/WebContent/assets/config'));
}

function obfsConf() {
  return gulp.src('./config/config.js')
  .pipe(javascriptObfuscator({disableConsoleOutput: true}))
  .pipe(gulp.dest(destPath+'/WebContent/assets/config'));
}

// gulp를 실행하면 default로 uglify task를 실행
gulp.task('default', gulp.series(['server', 'watch']));

gulp.task('tst-build', gulp.series([setEnvTst, copyConf, copyJs, copy, copyLib, copyWebContent, copyAssets]));
gulp.task('dev-build', gulp.series([setEnvDev, copyConf, copyJs, copy, copyLib, copyWebContent, copyAssets]));
gulp.task('stg-build', gulp.series([obfuscator, setEnvStg, obfsConf, copy, copyLib, copyWebContent, copyAssets]));
gulp.task('prd-build', gulp.series([obfuscator, setEnvPrd, obfsConf, copy, copyLib, copyWebContent, copyAssets]));
gulp.task('set-tst', gulp.series(setEnvTst, copyConf));
gulp.task('set-dev', gulp.series(setEnvDev, copyConf));
gulp.task('set-stg', gulp.series(setEnvStg, obfsConf));
gulp.task('set-prd', gulp.series(setEnvPrd, obfsConf));
