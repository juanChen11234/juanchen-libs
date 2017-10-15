var gulp = require('gulp');
var less = require('gulp-less');
var BrowserSync = require('browser-sync');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
//var cache = require('gulp-cache');
//var sourcemaps = require('gulp-sourcemaps');不要maps 写了体积增加了好多


//路径
var originPath='./src';
var goalPath='./dist';


//清除
gulp.task('clcJs', function(cb) {return del('./js/*/*.js', cb);});
gulp.task('clcCss', function(cb) {return del('./css/*/*.css', cb);});



gulp.task('css',['clcCss'], function () {
    return gulp.src(originPath+"/css/*/*.css")
	//.pipe(concat('app.css'))          //合并
	//.pipe(gulp.dest(goalPath))        //输出
	.pipe(minifycss())                  //压缩
	//.pipe(rename({suffix: '.min'}))   //rename
    .pipe(gulp.dest(goalPath+"/css"));  //输出/css/后面会加上*的目录名
});


gulp.task('js',['clcJs'], function() {
    return gulp.src([originPath+"/js/*/*.js",originPath+"/js/*.js"])
        //.pipe(concat('all.js'))            //合并
		//.pipe(gulp.dest(goalPath))         //输出
        .pipe(uglify())                      //压缩
		//.pipe(rename({suffix: '.min'}))    //rename
        .pipe(gulp.dest(goalPath+"/js"));    //输出/js/后面会加上*的目录名
});


//默认命令
gulp.task('default', function() {
    gulp.start('js','css');
});



















