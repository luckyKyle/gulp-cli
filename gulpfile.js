// 环境变量 dev开发环境 pro产品，默认开发
const ENV = process.env.NODE_ENV
const DEV = ENV === 'dev'

/************
Gulp 依赖
************/
const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer') // 自动添加css浏览器前缀
const buffer = require('vinyl-buffer')
const cleanCss = require('gulp-clean-css') // 压缩css
const connect = require('gulp-connect') // 本地服务器 自动刷新
const del = require('del') // 删除文件
const fileinclude = require('gulp-file-include') // 导入html公共部分
const htmlMin = require('gulp-htmlmin') // 压缩html
const imageMin = require('gulp-imagemin') // 压缩图片
const merge = require('merge-stream') // 合并流
const notify = require('gulp-notify') // 通知消息
const plumber = require('gulp-plumber') // 错误不终止watch
const pump = require('pump')
const rev = require('gulp-rev-append') // 添加版本号
const runSequence = require('run-sequence') // 同步执行gulp任务
const sass = require('gulp-sass') // 编译sass
const sourcemaps = require('gulp-sourcemaps') // 启用sourcemaps
const spritesmith = require('gulp.spritesmith') // 合并雪碧图
const uglify = require('gulp-uglify')

/************
 Rollup 依赖
************/
const rollup = require('rollup') // 引用Rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs') // node_modules中的包大部分都是commonjs格式的，要在rollup中使用必须先转为ES6语法
const eslint = require('rollup-plugin-eslint')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')

const DEST = 'dist'
    /* -------------
        开发环境
    --------------- */
    // 删除dist目录
if (DEV) { del.sync([DEST]) }

// 编译scss
gulp.task('sass', cb => {
    pump([
        gulp.src('src/scss/main.scss'),
        sourcemaps.init(),
        plumber({ // 错误不终止并给出提示
            errorHandler: notify.onError('Error: <%= error.message %>')
        }),
        sass().on('error', sass.logError),
        autoprefixer({
            browsers: ['last 5 versions'], // 向下兼容到IE8
            cascade: false // 是否美化属性值 默认：true
        }),
        sourcemaps.write('maps'),
        gulp.dest('dist/css'),
        connect.reload(),
        notify('scss编译完成')
    ], cb)
})

// 编译JS
gulp.task('es', async cb => {
    // 入口文件
    // const input = './src/js/main.js'
    const entry = ['./src/js/main.js', './src/js/moudules/a.js']

    const bundle = await rollup.rollup({
        input: './src/js/main.js',
        plugins: [
            resolve({
                jsnext: true, // 该属性是指定将Node包转换为ES2015模块
                // main 和 browser 属性将使插件决定将那些文件应用到bundle中
                main: true, // Default: true
                browser: true // Default: false
            }),
            eslint({
                throwOnError: true,
                throwOnWarning: true,
                include: ['src/**/*.js'],
                exclude: ['node_modules/**']
            }),
            commonjs(),
            json(),
            babel({
                exclude: 'node_modules/**' // 排除node_modules 下的文件
            }),
            replace({
                ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            })
        ]
    })

    await bundle.write({
        entry: entry,
        file: './dist/js/bundle.js', // 输出文件
        format: 'umd',
        name: 'bundle', // umd或iife模式下，若入口文件含 export，必须加上该属性,将作为全局变量挂在window下
        sourcemap: true,
        external: ['lodash', 'jquery'], // 告诉rollup不要将此lodash打包，而作为外部依赖
        global: {
            'jquery': '$' // 告诉rollup 全局变量$即是jquery
        }
    })

    return gulp.src('./dist/js/bundle.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
        .pipe(notify('es编译完成'))
})

// 雪碧图 图片的名字为a.png 对应的类为.icon-a
gulp.task('sprite', cb => {
    const option = {
        imgName: 'sprite.png', // 生成的图片名
        cssName: '_sprite.scss', // 生成的css文件名
        padding: 10, // 图标之间的距离
        algorithm: 'binary-tree', // 图标的排序方式
        cssTemplate: 'src/scss/handlebarsInheritance.scss.handlebars' // sprite输出模板
    }

    const spriteStream = pump([
        gulp.src('src/assets/img/sprite/**/*.*'),
        spritesmith(option)
    ])

    // 合并图片
    const imgStream = pump([
        spriteStream.img,
        buffer(),
        gulp.dest('src/assets/img')
    ])

    // 输出css
    const cssStream = pump([
        spriteStream.css,
        gulp.dest('src/scss/common'),
        connect.reload(),
        notify('图片合并完成')
    ])

    return merge(imgStream, cssStream)
})

// 迁移文件
gulp.task('copyStatic', cb => {
    // 迁移第三方引用的库或插件
    pump([
        gulp.src('src/lib/**'),
        gulp.dest('dist/lib')
    ])

    // 迁移字体
    pump([
        gulp.src('src/assets/fonts/**'),
        gulp.dest('dist/assets/fonts')
    ])

    // 迁移图片资源(过滤sprite文件夹)
    pump([
        gulp.src(['src/assets/img/*', '!src/assets/img/sprite']),
        gulp.dest('dist/assets/img'),
        connect.reload(),
        notify('静态资源迁移完成')
    ], cb)
})

// 导入html公共部分
gulp.task('fileinclude', cb => {
    pump([
        gulp.src(['src/index.html']),
        fileinclude({
            prefix: '@@',
            basepath: '@file'
        }),
        gulp.dest('dist')
    ])
    pump([
        gulp.src(['src/view/**']),
        fileinclude({
            prefix: '@@',
            basepath: '@file'
        }),
        gulp.dest('dist/view'),
        connect.reload(),
        notify('html编译完成')
    ], cb)
})

//  启动本地服务 并解决跨域
gulp.task('server', () => {
    connect.server({
        host: '', // 本地host，默认为“loacalhost”
        port: 9001, // 端口
        root: 'dist', // 根目录
        livereload: true // 自动刷新

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
gulp.task('watcher', () => {
    gulp.watch('src/js/**', ['es'])
    gulp.watch('src/scss/**', ['sass'])
    gulp.watch('src/assets/img/sprite/**', ['sprite'])
    gulp.watch('src/**/*.html', ['fileinclude'])
    gulp.watch(['src/lib/**', 'src/assets/img/**'], ['copyStatic'])
})

/*
---------------------------------------
以下是生产环境 资源压缩以及版本号添加
---------------------------------------
*/

// 压缩html
gulp.task('htmlMin', cb => {
    const option = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: false, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    }
    pump([
        gulp.src('dist/index.html'),
        htmlMin(option),
        rev(),
        gulp.dest('dist')
    ])
    pump(
        [
            gulp.src('dist/view/**/*.html'),
            htmlMin(option),
            rev(),
            gulp.dest('dist/view'),
            notify('html压缩完成')
        ], cb)
})

// 压缩css
gulp.task('cssMin', cb => {
    const option = {
        advanced: false, // 类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: 'ie7', // 保留ie7及以下兼容写法
        keepBreaks: true, // 类型：Boolean 默认：false [是否保留换行]
        keepSpecialComments: '*' // 保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }
    pump([
        gulp.src('dist/css/main.css'),
        cleanCss(option),

        gulp.dest('dist/css'),
        notify('css压缩完成')
    ], cb)
})

// 压缩js
gulp.task('jsMin', cb => {
    pump([
        gulp.src('dist/js/**/*.js'),
        uglify(),
        gulp.dest('./dist/js'),
        notify('js压缩完成')
    ], cb)
})

// 压缩图片
gulp.task('imageMin', cb => {
    pump([
        gulp.src('src/assets/img/**'),
        imageMin({
            optimizationLevel: 5, // 类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, // 类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, // 类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true // 类型：Boolean 默认：false 多次优化svg直到完全优化
        }),
        gulp.dest('dist/img'),
        notify('img压缩完成')
    ], cb)
})

gulp.task('default', () => {
    if (DEV) {
         // 开发环境，编译处理
        runSequence(
            'sprite', ['sass', 'es', 'fileinclude', 'copyStatic'],
            'watcher',
            'server'
        )
    } else {
        // 生产环境，压缩处理
        runSequence(['cssMin', 'jsMin', 'imageMin', 'htmlMin'])
    }
})
