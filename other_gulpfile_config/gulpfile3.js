var gulp  = require('gulp');

var sass = require('gulp-sass');//编译sass
var cssMin = require('gulp-minify-css');//压缩css
var imageMin = require('gulp-imagemin');//压缩图片
var rev = require('gulp-rev');//MD5
var htmlmin = require('gulp-htmlmin');//压缩html

var rev = require('gulp-rev');//MD5
var revCollector = require('gulp-rev-collector');//替换时间戳


gulp.task('sass',function(){
    return gulp.src('./SASS/*.scss')
                .pipe(sass())
                .pipe(cssMin())
                .pipe(rev())
                .pipe(gulp.dest('dist/stylesheet'))
                .pipe( rev.manifest() )
                .pipe( gulp.dest( 'rev/stylesheet' ) );
});

gulp.task('imagemin', function () {
    return gulp.src('./images/*.{png,jpg,gif,ico}')
                .pipe(imageMin({
                    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
                }))
                .pipe(rev())
                .pipe(gulp.dest('dist/images'))
                .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
                .pipe(gulp.dest('./rev/images'));
});

gulp.task('revCollector',['revCollectorCss'], function () {
    var options = {
        removeComments: true,  //清除HTML注释
        collapseWhitespace: true,  //压缩HTML
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,  //压缩页面JS
        minifyCSS: true  //压缩页面CSS
    };
    return gulp.src(['rev/**/*.json', './*.html'])
            .pipe( revCollector())
            .pipe(htmlmin(options))
            .pipe( gulp.dest('dist/'));
});
gulp.task('revCollectorCss',['sass','imagemin'], function () {
    return gulp.src(['rev/**/*.json', './dist/stylesheet/*.css'])
                .pipe(revCollector())
                .pipe(gulp.dest('dist/stylesheet'));
});

gulp.task('auto', function () {
    gulp.watch('./SASS/*.scss', ['sass']);
});

gulp.task('default', [ 'auto','revCollector']);