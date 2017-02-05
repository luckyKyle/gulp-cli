/*******************************
             Gulp plugins
*******************************/
var gulp = require('gulp'),
    sass = require('gulp-sass'), //sass编译
    autoprefixer = require('gulp-autoprefixer'), //css3前缀
    sourcemaps = require('gulp-sourcemaps'), //启用
    browserSync = require('browser-sync'), //静态服务器
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

    fileinclude = require('gulp-file-include'), //include
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'), //合并
    usemin = require('gulp-usemin'); //合并静态资源及路由

/*--------------
      Path
---------------*/
var _path = {
    dirs: {
        app: 'app/',
        dev: 'dev/',
        dist: 'dist/',
    },
    app: {
        scss: 'app/scss/',
        css: 'app/css/',
        fonts: 'app/fonts/',
        images: 'app/images/',
        sprite: 'app/images/sprite',
        include: 'app/include/',
        js: 'app/js/',
        tpl: 'app/tpl/',
    },
    dev: {
        css: 'dev/css/',
        fonts: 'dev/fonts/',
        images: 'dev/images/',
        include: 'dev/include/',
        maps: 'dev/maps/',
        js: 'dev/js/'
    },
    dist: {
        css: 'dist/css/',
        fonts: 'dist/fonts/',
        images: 'dist/images/',
        js: 'dist/js/'
    }
};


/*--------------
      Start browserSync server
---------------*/
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: _path.dirs.app
        }
    });
});


/*--------------
      Sass处理
---------------*/
gulp.task('sass', ['clean:css'], function() {
    return gulp.src(_path.app.scss + '**/*.scss') // 输入目录
        .pipe(sourcemaps.init()) //启用sourcemaps
        .pipe(sass().on('error', sass.logError)) // 将sass报错记录到日志
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(browserSync.reload({ stream: true })) // 同步更新
        .pipe(gulp.dest(_path.app.css)) // 输出目录
        .pipe(notify({ message: "SASS任务编译完成" }));
});

/*--------------
      Watchers
---------------*/
gulp.task('watch', function() {
    gulp.watch(_path.app.scss + '**/*.scss', ['sass']);
    gulp.watch(_path.dirs.app + '/**/*.html', browserSync.reload);
    gulp.watch(_path.app.js + '**/*.js', browserSync.reload);
});

/*--------------
      Merge Static
---------------*/
gulp.task('usemin', function() {
    return gulp.src(_path.dirs.dev + '**/*.html')
        .pipe(usemin({
            js: [uglify()],
            css: [cssmin()]
        }))
        .pipe(gulp.dest(_path.dirs.dist))
        .pipe(notify({ message: "合并静态文件路由完成" })); //提示;
});

/*--------------
     Optimizing Html
---------------*/
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
    gulp.src(_path.dirs.dist + '**/*.html')
        .pipe(htmlmin(options))
        .pipe(rev())
        .pipe(gulp.dest(_path.dirs.dist))
        .pipe(notify({ message: 'html压缩完成' })); //提示成功
});

/*--------------
     Optimizing Fonts
---------------*/
gulp.task('minifyFont', function() {
    gulp.src(_path.app.fonts + '*.+(otf|eot|svg|ttf|woff)')
        .pipe(fontmin({}))
        .pipe(gulp.dest(_path.dev.fonts))
        .pipe(notify({
            message: '字体压缩完成'
        }));
});


/*--------------
     Optimizing Image
---------------*/
gulp.task('minifyImg', function() {
    gulp.src(_path.app.images + '*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({ //压缩未经压缩的图片
            optimizationLevel: 5, // 默认：3  取值范围：0-7（优化等级）
            progressive: true, // 默认：false 无损压缩jpg图片
            interlaced: true, // 默认：false 隔行扫描gif进行渲染
            multipass: true // 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest(_path.dev.images));
});


/*--------------
     Img Sprite
---------------*/
gulp.task('sprite', function() {
    var spriteData = gulp.src(_path.app.images + "sprite/**/*.+(png|jpg|jpeg|gif|svg)")
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.scss',
            padding: 10, // 图标之间的距离
            algorithm: 'binary-tree', // 图标的排序方式
            cssTemplate: _path.app.tpl + 'sprite/handlebarsInheritance.scss.handlebars' // 模板
        }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(gulp.dest(_path.app.images));

    var cssStream = spriteData.css
        .pipe(gulp.dest(_path.app.scss + "sprite"))
        .pipe(notify({ message: "图片压缩完成" })); //提示

    return merge(imgStream, cssStream);

});

/*--------------
     MD5 Added
---------------*/
gulp.task('rev', function() {
    return gulp.src(_path.dirs.dist + "**/*.html")
        .pipe(rev())
        .pipe(gulp.dest(_path.dirs.dist))
        .pipe(notify({
            message: 'md5后缀添加成功'
        }));
});


/*--------------
     Include Module
---------------*/
gulp.task('include', function() {
    return gulp.src(_path.dirs.app + "**/*.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(_path.dirs.dev))
        .pipe(notify({
            message: 'html模块编译成功'
        }));
});


/*--------------
     Clone
---------------*/

gulp.task('css:dev', function() {
    return gulp.src(_path.app.css + '**/*')
        .pipe(gulp.dest(_path.dev.css));
});

gulp.task('js:dev', function() {
    return gulp.src(_path.app.js + '**/*')
        .pipe(gulp.dest(_path.dev.js));
});

gulp.task('css:dist', function() {
    return gulp.src(_path.dev.css + '**/*')
        .pipe(gulp.dest(_path.dist.css));
});

gulp.task('fonts:dist', function() {
    return gulp.src(_path.dev.fonts + '**/*')
        .pipe(gulp.dest(_path.dist.fonts));
});

gulp.task('images:dist', function() {
    return gulp.src(_path.dev.images + '**/*')
        .pipe(gulp.dest(_path.dist.images));
});


/*--------------
     Cleaning Something
---------------*/
gulp.task('clean:dev', function() {
    return del.sync([_path.dirs.dev + '**/*', '!dev/images']);
});

gulp.task('clean:dist', function() {
    return del.sync([_path.dirs.dist + '**/*', '!dist/images']);
});

gulp.task('clean:include', function() {
    return del.sync([_path.dev.include]);
});

gulp.task('clean:maps', function() {
    return del.sync([_path.dev.maps]);
});

gulp.task('clean:css', function() {
    return del.sync([_path.app.css + '**/*']);
});


// Dev Sequences
// --------------->
gulp.task('dev', function(callback) {
    runSequence(
        'clean:dev', 'include', ['css:dev', 'js:dev'], ['minifyImg', 'minifyFont'], ['clean:include', 'clean:maps'],
        callback
    );
});

// Build Sequences
// --------------->
gulp.task('build', function(callback) {
    runSequence(
        'clean:dist', 'usemin', ['images:dist', 'fonts:dist'], 'rev', 'minifyHtml',
        callback
    );
});

// Default Sequences  
// --------------->
gulp.task('default', function(callback) {
    runSequence('sprite', ['sass', 'browserSync'], 'watch',
        callback
    );
});