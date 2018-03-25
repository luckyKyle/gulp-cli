//环境变量 dev开发环境 pro产品，默认开发
const ENV = process.env.NODE_ENV;
const DEV = ENV === "dev";
const PRO = ENV === "build";

const DEST = "dist";

// 依赖
const gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"), //自动添加浏览器前缀
  assign = require("lodash.assign"),
  babel = require("gulp-babel"), // es6转es5
  babelify = require("babelify"),
  browserify = require("browserify"),
  buffer = require("vinyl-buffer"),
  cleanCss = require("gulp-clean-css"), //压缩css
  concat = require("gulp-concat"), //合并js
  connect = require("gulp-connect"), //本地服务器 自动刷新
  del = require("del"), //删除文件
  fileinclude = require("gulp-file-include"), //导入html公共部分
  gutil = require("gulp-util"),
  htmlMin = require("gulp-htmlmin"), //压缩html
  imageMin = require("gulp-imagemin"), //压缩图片
  sass = require("gulp-sass"), // 编译less
  livereload = require("gulp-livereload"), //自动刷新，需配合浏览器插件livereload
  notify = require("gulp-notify"), //通知消息
  plumber = require("gulp-plumber"), //错误不终止watch
  proxy = require("http-proxy-middleware"), //本地服务器代理
  pump = require("pump"),
  runSequence = require("run-sequence"), //同步执行gulp任务
  source = require("vinyl-source-stream"),
  sourcemaps = require("gulp-sourcemaps"), //启用sourcemaps
  spritesmith = require("gulp.spritesmith"), //合并雪碧图
  uglify = require("gulp-uglify"),
  watchify = require("watchify"); // 压缩js

//删除dist下面的文件
del.sync(["dist"]);

//压缩sass
gulp.task("cssMin", cb => {
  if (ENV) {
    pump(
      [
        gulp.src("src/style/main.scss"),
        sourcemaps.init(),
        plumber({
          //错误不终止并给出提示
          errorHandler: notify.onError("Error: <%= error.message %>")
        }),
        sass().on("error", sass.logError),
        autoprefixer({
          browsers: ["last 5 versions"], //向下兼容到IE8
          cascade: false //是否美化属性值 默认：true
        }),
        sourcemaps.write("maps"),
        gulp.dest("dist/css"),
        connect.reload()
      ],
      cb
    );
  } else {
    pump(
      [
        gulp.src("src/style/*"),
        less(),
        autoprefixer({
          browsers: ["last 5 versions"], //向下兼容到IE8
          cascade: false //是否美化属性值 默认：true
        }),
        cleanCss({
          advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
          compatibility: "ie7", //保留ie7及以下兼容写法
          keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
          keepSpecialComments: "*" //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }),
        gulp.dest("dist/css")
      ],
      cb
    );
  }
});

// 在这里添加自定义 browserify 选项
const customOpts = {
  entries: ["./src/js/index.js"],
  debug: true
};
const opts = assign({}, watchify.args, customOpts);
const b = watchify(browserify(opts));

function bundle() {
  return (
    b
      .bundle()
      // 如果有错误发生，记录这些错误
      .on("error", gutil.log.bind(gutil, "Browserify Error"))
      .pipe(source("bundle.js"))
      // 可选项，如果你不需要缓存文件内容，就删除
      .pipe(buffer())
      // 可选项，如果你不需要 sourcemaps，就删除
      .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
      // 在这里将变换操作加入管道
      .pipe(sourcemaps.write("./")) // 写入 .map 文件
      .pipe(gulp.dest("./dist/js"))
  );
}

gulp.task('jsMin', bundle); // 这样你就可以运行 `gulp js` 来编译文件了
b.on('update', bundle); // 当任何依赖发生改变的时候，运行打包工具
b.on('log', gutil.log); // 输出编译日志到终端

//雪碧图 图片的名字为a.png 对应的类为.icon-a
gulp.task("spritesmith", cb => {
  pump(
    [
      gulp.src("src/assets/img/sprite/**/*"),
      spritesmith({
        imgName: "img/sprite.png",
        cssName: "less/sprite.less",
        padding: 20,
        algorithm: "binary-tree",
        cssTemplate: "src/assets/img/sprite/template.css"
      }),
      gulp.dest("dist/assets/img"),
      connect.reload()
    ],
    cb
  );
});

//压缩图片
gulp.task("imageMin", ["cssMin"], cb => {
  pump(
    [
      gulp.src("src/assets/img/*.{png,jpg,gif,ico}"),
      imageMin({
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
      }),
      gulp.dest("dist/img"),
      connect.reload()
    ],
    cb
  );
});

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
  };
  if (DEV) {
    pump([gulp.src("dist/*.html"), gulp.dest("dist"), connect.reload()], cb);
  } else {
    pump(
      [
        gulp.src("dist/*.html"),
        htmlMin(options),
        gulp.dest("dist"),
        connect.reload()
      ],
      cb
    );
  }
});

//迁移文件
gulp.task("copyStatic", cb => {
  pump([
    //迁移第三方引用的库或插件
    gulp.src("src/lib/**/*"),
    gulp.dest("dist/lib")
  ]);

  pump(
    [
      //迁移图片
      gulp.src(["src/assets/img/*", "!src/assets/img/sprite"]),
      gulp.dest("dist/img"),
      connect.reload()
    ],
    cb
  );
});

//导入html公共部分
gulp.task("fileinclude", cb => {
  pump([
    gulp.src(["src/index.html"]),
    fileinclude({
      prefix: "@@",
      basepath: "@file"
    }),
    gulp.dest("dist"),
    connect.reload()
  ]);

  pump(
    [
      gulp.src(["src/view/*.html"]),
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      }),
      gulp.dest("dist/view"),
      connect.reload()
    ],
    cb
  );
});

//  启动本地服务 并解决跨域
gulp.task("server", () => {
  connect.server({
    host: "", //本地host，默认为“loacalhost”
    port: 8088, //端口
    root: "./", //根指向
    livereload: true //自动刷新
    // middleware(connect, opt) { //中间件配置
    //     return [
    //         proxy('/webapi', { //代理配置
    //             target: 'http://10.10.40.33:8604', //跨域指向
    //             changeOrigin: true
    //         })
    //     ]
    // }
  });
});

// 监听热更新
gulp.task("watcher", () => {
  gulp.watch("src/ts/**/*", ["jsMin"]);
  gulp.watch("src/style/**/*", ["cssMin"]);
  gulp.watch("src/assets/img/sprite/**/*", ["spritesmith"]);
  gulp.watch("src/**/*.html", ["fileinclude"]);
  gulp.watch(["src/lib/**/*", "src/assets/img/**/*"], ["copyStatic"]);
});

gulp.task("default", () => {
  runSequence(
    ["cssMin", "jsMin", "imageMin", "fileinclude", "copyStatic"],
    "htmlMin",
    "watcher",
    "server"
  );
});

// gulp.task("default", () => {
//     runSequence(
//         "spritesmith", ["cssMin", "jsMin", "imageMin", "fileinclude", "copyStatic"],
//         "htmlMin", "watcher"
//     )
// })
