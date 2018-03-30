//环境变量 dev开发环境 pro产品，默认开发
const ENV = process.env.NODE_ENV
const DEV = ENV === "dev"
const PRO = ENV === "build"

// 依赖
const gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"), //自动添加浏览器前缀
    assign = require("lodash.assign"),
    babelify = require("babelify"),
    browserify = require("browserify"), // 模块化编译 
    buffer = require('vinyl-buffer'),
    cleanCss = require("gulp-clean-css"), //压缩css
    concat = require("gulp-concat"), //合并js
    connect = require("gulp-connect"), //本地服务器 自动刷新
    del = require("del"), //删除文件
    fileinclude = require("gulp-file-include"), //导入html公共部分
    gutil = require('gulp-util'),
    htmlMin = require("gulp-htmlmin"), //压缩html
    imageMin = require("gulp-imagemin"), //压缩图片
    merge = require('merge-stream'), //合并流
    notify = require("gulp-notify"), //通知消息
    plumber = require("gulp-plumber"), //错误不终止watch
    proxy = require("http-proxy-middleware"), //本地服务器代理
    pump = require("pump"),
    runSequence = require("run-sequence"), //同步执行gulp任务
    rename = require("gulp-rename"),
    sass = require("gulp-sass"), // 编译sass
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"), //启用sourcemaps
    spritesmith = require("gulp.spritesmith"), //合并雪碧图
    uglify = require("gulp-uglify"),
    watchify = require("watchify") // 压缩js

/*--------------------
    开发环境
-------------------*/

// 删除build目录
const DEST = "build"
if (DEV) {
    del.sync([DEST])
}

//编译scss
gulp.task("sass", cb => {
    pump(
        [
            gulp.src("src/style/main.scss"),
            sourcemaps.init(),
            plumber({ //错误不终止并给出提示
                errorHandler: notify.onError("Error: <%= error.message %>")
            }),
            sass().on("error", sass.logError),
            autoprefixer({
                browsers: ["last 5 versions"], //向下兼容到IE8
                cascade: false //是否美化属性值 默认：true
            }),
            sourcemaps.write("maps"),
            gulp.dest("build/css"),
            connect.reload(),
            notify("css编译完成")
        ],
        cb
    )
})

//编译JS
gulp.task("es", cb => {
    // 入口文件
    const entriesFiles = ["./src/js/index.js"]

    // 在这里添加自定义 browserify 选项
    const customOpts = {
        entries: entriesFiles,
        debug: true
    }
    const opts = assign({}, watchify.args, customOpts)
    const b = watchify(browserify(opts))

    return b.transform(babelify)
        .bundle()
        .on('error', () => {
            notify.onError("Error: <%= error.message %>")
                // let args = Array.prototype.slice.call(arguments)

            // //Send error to notification center with gulp-notify
            // notify.onError({
            //     title: "Compile Error",
            //     message: "<%= error.message %>"
            // }).apply(this, args)

            // //Keep gulp from hanging on this task
            // this.emit('end')
        })

    .pipe(source("bundle.js"))
        .pipe(gulp.dest("./build/js"))
        .pipe(connect.reload())
        .pipe(notify("es编译完成"))
})

//雪碧图 图片的名字为a.png 对应的类为.icon-a
gulp.task("sprite", cb => {
    const option = gulp.src("src/assets/img/sprite/**/*.*")
        .pipe(spritesmith({
            imgName: 'sprite.png', //生成的图片名
            cssName: '_sprite.scss', //生成的css文件名
            padding: 10, // 图标之间的距离
            algorithm: 'binary-tree', // 图标的排序方式
            cssTemplate: 'src/style/handlebarsInheritance.scss.handlebars' // 模板
        }))

    // 合并图片
    const imgStream = option.img
        .pipe(buffer()) //合并
        .pipe(gulp.dest("src/assets/img"))

    // 自动生成css
    const cssStream = option.css
        .pipe(gulp.dest("src/style"))
        .pipe(connect.reload())
        .pipe(notify("图片合并完成"))

    return merge(imgStream, cssStream)
})

//迁移文件
gulp.task("copyStatic", cb => {
    pump([
        //迁移第三方引用的库或插件
        gulp.src("src/lib/**/*"),
        gulp.dest("build/lib")
    ])


    pump([
        //迁移字体
        gulp.src("src/assets/fonts/**/*"),
        gulp.dest("build/assets/fonts")
    ])

    pump(
        //迁移图片资源(过滤sprite文件夹)
        [
            gulp.src(["src/assets/img/*", "!src/assets/img/sprite"]),
            gulp.dest("build/assets/img"),
            connect.reload(),
            notify("静态资源迁移完成")
        ],
        cb
    )
})

//导入html公共部分
gulp.task("fileinclude", cb => {
    pump([
        gulp.src(["src/index.html"]),
        fileinclude({
            prefix: "@@",
            basepath: "@file"
        }),
        gulp.dest("build")
    ])
    pump(
        [
            gulp.src(["src/view/**/*.html"]),
            fileinclude({
                prefix: "@@",
                basepath: "@file"
            }),
            gulp.dest("build/view"),
            connect.reload(),
            notify("html编译")
        ],
        cb
    )
})

//  启动本地服务 并解决跨域
gulp.task("server", () => {
    connect.server({
        host: "", //本地host，默认为“loacalhost”
        port: 9001, //端口
        root: "build", //根目录
        livereload: true //自动刷新
            // middleware(connect, opt) { //中间件配置
            //     return [
            //         proxy('/webapi', { //代理配置
            //             target: 'http://10.10.40.33:8604', //跨域指向
            //             changeOrigin: true
            //         })
            //     ]
            // }
    })
})

// 监听热更新
gulp.task("watcher", () => {
    gulp.watch("src/js/**/*.js", ["es"])
    gulp.watch("src/style/**/*.scss", ["sass"])
    gulp.watch("src/assets/img/sprite/**/*", ["sprite"])
    gulp.watch("src/**/*.html", ["fileinclude"])
    gulp.watch(["src/lib/**/*.*", "src/assets/img/**/*"], ["copyStatic"])
})

gulp.task("default", () => {
    runSequence(
        "sprite", ["sass", "es", "fileinclude", "copyStatic"],
        "watcher",
        "server"
    )
})

/*
---------------------------------------
以下是生产环境 资源压缩以及版本号添加
---------------------------------------
*/

//压缩html
gulp.task("htmlMin", cb => {
    const options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    }
    pump([gulp.src("build/index.html"), htmlMin(options), gulp.dest("build")])
    pump(
        [
            gulp.src("build/view/**/*.html"),
            htmlMin(options),
            gulp.dest("build/view"),
            notify("html压缩完成")
        ],
        cb
    )
})

// 压缩css
gulp.task("cssMin", cb => {
    const options = {
        advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: "ie7", //保留ie7及以下兼容写法
        keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
        keepSpecialComments: "*" //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }
    pump(
        [
            gulp.src("build/css/main.css"),
            cleanCss(options),
            // rename({ suffix: ".min" }),
            gulp.dest("build/css"),
            notify("css压缩完成")
        ],
        cb
    )
})

// 压缩js
gulp.task("jsMin", cb => {
    pump(
        [
            gulp.src("build/js/**/*.js"),
            uglify(),
            rename({ suffix: "min" }),
            gulp.dest("./build/js"),
            notify("js压缩完成")
        ],
        cb
    )
})

//压缩图片
gulp.task("imageMin", cb => {
    pump(
        [
            gulp.src("src/assets/img/*.{png,jpg,gif,ico}"),
            imageMin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            }),
            gulp.dest("build/img"),
            notify("img压缩完成")
        ],
        cb
    )
})

gulp.task("build", () => {
    runSequence(["cssMin", "jsMin", "imageMin"], "htmlMin")
})