// 引入 gulp及组件
var gulp = require('gulp'), //gulp基础库
    sass = require('gulp-sass'), //编译Sass
    sourcemaps = require('gulp-sourcemaps'), //语法糖报错地图
    autoprefixer = require('gulp-autoprefixer'), //css3前缀
    concat = require('gulp-concat'), //合并文件
    htmlmin = require('gulp-htmlmin'), //html压缩
    minifyCss = require('gulp-minify-css'), //css压缩
    uglify = require('gulp-uglify'), //js压缩
    imagemin = require('gulp-imagemin'), //图片压缩
    pngquant = require('imagemin-pngquant'), //图片深度压缩
    cache = require('gulp-cache'), //图片缓存，减少重复压缩图片
    jshint = require('gulp-jshint'), //js检查
    rename = require('gulp-rename'), //文件重命名
    browserSync = require('browser-sync'), //浏览器自动刷新
    runSequence = require('run-sequence'), //优先执行队列
    del = require('del'), //清理生成文件
    rev = require('gulp-rev'), //MD
    revCollector = require('gulp-rev-collector'), //替换时间戳
    notify = require('gulp-notify'); //提示

var _APP = 'app/',
    _DIST = 'dist/',
    _REV = 'app/rev/';


//Sass处理
gulp.task('sass', function() {
    return gulp.src(_APP + 'scss/*.scss') // 输入目录
        .pipe(sourcemaps.init()) //启用sourcemaps
        .pipe(sass().on('error', sass.logError)) // 将sass报错记录到日志
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(concat('style.min.css')) //合并css文件
        .pipe(minifyCss()) //压缩css
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(_DIST + 'css')) // 输出目录
        .pipe(browserSync.reload({ // 同步更新
            stream: true
        }))
        .pipe(notify({ message: "scss task ok" }));
});

//html处理
gulp.task('minifyHtml', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(_APP + '**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(_DIST))
        .pipe(notify({ message: 'html task ok' })); //提示成功
});

//JS处理
gulp.task('minifyJs', function() {
    return gulp.src(_APP + 'js/**/*.js', { base: 'app' }) //选择合并的JS,'base'确保是同一个目录下
        .pipe(sourcemaps.init()) //启用sourcemaps
        .pipe(concat('main.min.js')) //合并css文件
        .pipe(uglify()) //压缩js
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(_DIST + '/js')) //输出至发布环境
        .pipe(notify({ message: "js task ok" })); //提示
});

// 图片处理
gulp.task('minifyImages', function() {
    return gulp.src(_APP + 'images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({ //压缩未经压缩的图片
            optimizationLevel: 5, // 默认：3  取值范围：0-7（优化等级）
            progressive: true, // 默认：false 无损压缩jpg图片
            interlaced: true, // 默认：false 隔行扫描gif进行渲染
            multipass: true, // 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
            use: [pngquant()] //深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(_DIST + 'images/'))
        .pipe(notify({ message: "images task ok" })); //提示
});


//清理并重新生成DIST
gulp.task('clean:dist', function() {
    return del.sync([_DIST + '/**/*', '!dist/images', '!dist/images/**/*']);
});

// 监听
gulp.task('watch', function() {
    gulp.watch(_APP + 'scss/**/*.scss', ['sass']);
    gulp.watch(_APP + '**/*.html', browserSync.reload);
    gulp.watch(_APP + 'js/**/*.js', browserSync.reload);
});


// 执行队列
gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'sass',
        'watch', ['minifyHtml', 'minifyJs', 'minifyImages'],
        callback
    );
});

//开启本地服务并自动刷新
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: _APP //默认运行目录
        }
    });
});

// 默认启动任务，直接"gulp"命令执行
gulp.task('default', function(callback) {
    runSequence(['build', 'browserSync'], 'watch',
        callback
    );
});