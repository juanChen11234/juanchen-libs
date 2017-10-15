var gulp = require('gulp');
var less = require('gulp-less');
var BrowserSync = require('browser-sync');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
//var cache = require('gulp-cache');
//var sourcemaps = require('gulp-sourcemaps');��Ҫmaps д����������˺ö�


//·��
var originPath='./src';
var goalPath='./dist';


//���
gulp.task('clcJs', function(cb) {return del('./js/*/*.js', cb);});
gulp.task('clcCss', function(cb) {return del('./css/*/*.css', cb);});



gulp.task('css',['clcCss'], function () {
    return gulp.src(originPath+"/css/*/*.css")
	//.pipe(concat('app.css'))          //�ϲ�
	//.pipe(gulp.dest(goalPath))        //���
	.pipe(minifycss())                  //ѹ��
	//.pipe(rename({suffix: '.min'}))   //rename
    .pipe(gulp.dest(goalPath+"/css"));  //���/css/��������*��Ŀ¼��
});


gulp.task('js',['clcJs'], function() {
    return gulp.src([originPath+"/js/*/*.js",originPath+"/js/*.js"])
        //.pipe(concat('all.js'))            //�ϲ�
		//.pipe(gulp.dest(goalPath))         //���
        .pipe(uglify())                      //ѹ��
		//.pipe(rename({suffix: '.min'}))    //rename
        .pipe(gulp.dest(goalPath+"/js"));    //���/js/��������*��Ŀ¼��
});


//Ĭ������
gulp.task('default', function() {
    gulp.start('js','css');
});



















