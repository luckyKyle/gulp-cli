/*******************************
 Gulp plugins
 *******************************/
const gulp = require('gulp'),
    sass = require('gulp-sass'), //sass编译
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'), //css3前缀
    sourcemaps = require('gulp-sourcemaps'), //启用
    browserSync = require('browser-sync'), //热更新
    gulpIf = require('gulp-if'), //判断文件类型做相应动作
    htmlmin = require('gulp-htmlmin'), //html压缩
    cssmin = require('gulp-clean-css'), //css压缩
    uglify = require('gulp-uglify'), //js压缩
    imagemin = require('gulp-imagemin'), //图片压缩
    fontmin = require('gulp-fontmin'), //字体压缩
    rev = require('gulp-rev-append-all'), //MD5戳
    cache = require('gulp-cache'), //缓存图片
    del = require('del'), // del
    runSequence = require('run-sequence'), //同步异步执行代码
    notify = require("gulp-notify"), //消息通知
    spritesmith = require('gulp.spritesmith'), //图片精灵

    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'), //合并
    usemin = require('gulp-usemin'); //合并静态资源及路由

/*--------------
 Path
 ---------------*/
var _path = {
    app: {
        assets: 'app/assets',
        views: 'app/views/',
        scss: 'app/assets/scss/',
        css: 'app/assets/css/',
        js: 'app/assets/js/',
        fonts: 'app/assets/fonts/',
        imgs: 'app/assets/imgs/',
        images: 'app/images/',
        libs: 'app/libs/',
        sprite: 'app/assets/imgs/sprite',
        tpl: 'app/tpl/',
    },
    dist: {
        assets: 'dist/assets/',
        views: 'dist/views/',
        css: 'dist/assets/css/',
        fonts: 'dist/assets/fonts/',
        imgs: 'dist/assets/imgs/',
        images: 'dist/images/',
        libs: 'dist/libs/',
        js: 'dist/assets/js/'
    }
};


/*--------------
 Start browserSync server
 ---------------*/
gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: 'app/'
        }
    });
});


/*--------------
 Sass处理
 ---------------*/
gulp.task('sass', ['clean:css'], () => {
    return gulp.src(_path.app.scss + '**/*.scss') // 输入目录
        .pipe(sourcemaps.init()) //启用sourcemaps
        .pipe(sass().on('error', sass.logError)) // 将sass报错记录到日志
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(browserSync.reload({ stream: true })) // 同步更新
        .pipe(gulp.dest('app/assets/css/')) // 输出目录
        .pipe(notify({ message: "SASS任务编译完成" }));
});

/*--------------
 es6处理
 ---------------*/
gulp.task('babel', () => {
    gulp.src(_path.app.js + '**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest(_path.dist.js))
        .pipe(notify({ message: "ES6转换ES5完成" })); //提示
});


/*--------------
 Watchers
 ---------------*/
gulp.task('watch', () => {
    gulp.watch('app/' + '**/*.html', browserSync.reload);
    gulp.watch(_path.app.scss + '**/*.scss', ['sass'], browserSync.reload);
    gulp.watch(_path.app.js + '**/*.js', browserSync.reload);
});

/*--------------
 Merge Static
 ---------------*/
gulp.task('usemin', () => {
    return gulp.src(_path.app.views + '**/*.html')
        .pipe(usemin({
            js: [uglify()],
            css: [cssmin()]
        }))
        .pipe(gulp.dest(_path.dist.views))
        .pipe(notify({ message: "合并静态文件路由完成" })); //提示;
});

/*--------------
 Optimizing Html
 ---------------*/
gulp.task('minifyHtml', () => {
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
    gulp.src('app/views/' + '**/*.html')
        .pipe(htmlmin(options))
        .pipe(rev())
        .pipe(gulp.dest('dist/views'))
        .pipe(notify({ message: 'html压缩完成' })); //提示成功
});

/*--------------
 Optimizing Fonts
 ---------------*/
gulp.task('minifyFont', () => {
    gulp.src('app/assets/fonts' + '*.+(otf|eot|svg|ttf|woff)')
        .pipe(fontmin({}))
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(notify({
            message: '字体压缩完成'
        }));
});


/*--------------
 Optimizing Image
 ---------------*/
gulp.task('minifyImg', () => {
    gulp.src('app/assets/images' + '*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({ //压缩未经压缩的图片
            optimizationLevel: 5, // 默认：3  取值范围：0-7（优化等级）
            progressive: true, // 默认：false 无损压缩jpg图片
            interlaced: true, // 默认：false 隔行扫描gif进行渲染
            multipass: true // 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(notify({ message: "图片压缩完成" })); //提示
});


/*--------------
 Img Sprite
 ---------------*/
gulp.task('sprite', () => {
    var spriteData = gulp.src('app/assets/images/' + "sprite/**/*.+(png|jpg|jpeg|gif|svg)")
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.scss',
            padding: 10, // 图标之间的距离
            algorithm: 'binary-tree', // 图标的排序方式
            cssTemplate: _path.app.tpl + 'sprite/handlebarsInheritance.scss.handlebars' // 模板
        }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(gulp.dest('app/assets/images/'))
        .pipe(notify({ message: "icon合并完成" })); //提示

    var cssStream = spriteData.css
        .pipe(gulp.dest("app/assets/scss/sprite"))
        .pipe(notify({ message: "sprite已生成mixin" })); //提示

    return merge(imgStream, cssStream);
});

/*--------------
 MD5 Added
 ---------------*/
gulp.task('rev', () => {
    return gulp.src(_path.dist.views + "**/*.html")
        .pipe(rev())
        .pipe(gulp.dest(_path.dist.views))
        .pipe(notify({
            message: 'md5后缀添加成功'
        }));
});


/*--------------
 Clone
 ---------------*/
gulp.task('images:dist', () => { //前景图
    return gulp.src(_path.app.images + '**/*')
        .pipe(gulp.dest(_path.dist.images));
});
gulp.task('libs:dist', () => { //第三方库
    return gulp.src(_path.app.libs + '**/*')
        .pipe(gulp.dest(_path.dist.libs));
});


/*--------------
 Cleaning Something
 ---------------*/

gulp.task('clean:dist', () => {
    return del.sync(['dist/' + '**/*', '!dist/images']);
});

gulp.task('clean:css', () => {
    return del.sync([_path.app.css + '**/*']);
});


// Build Sequences
// --------------->
gulp.task('build', () => {
    runSequence(
        'clean:dist',
        'images:dist',
        'libs:dist',
        'usemin', ['minifyImg', 'minifyFont'],
        'rev',
        'minifyHtml'
    );
});

// Default Sequences
// --------------->
gulp.task('default', () => {
    runSequence(
        'sprite', ['sass', 'babel', 'browserSync'],
        'watch'
    );
});