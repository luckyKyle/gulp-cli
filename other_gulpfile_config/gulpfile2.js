var gulp = require('gulp'), // 必须先引入gulp插件
    clean = require('gulp-clean'),  // 文件删除
    less = require('gulp-less'), // less 编译
    gutil = require('gulp-util'),// 控制台着色
    cached = require('gulp-cached'), // 缓存当前任务中的文件，只让已修改的文件通过管道
    uglify = require('gulp-uglify'), // js 压缩
    rename = require('gulp-rename'), // 重命名
    concat = require('gulp-concat'), // 合并文件
    notify = require('gulp-notify'), // 修改提醒
    cssnano = require('gulp-cssnano'), // CSS 压缩
    imagemin = require('gulp-imagemin'), // 图片优化
    browserSync = require('browser-sync'), // 保存自动刷新
    autoprefixer = require('gulp-autoprefixer');// 添加 CSS 浏览器前缀

//--------------------------common  tasks-----------------------------

//编译less--发布到本文件夹下相应目录
gulp.task('lessLocal', function() {
    return gulp.src('src/css/*.less',{base:'./src'})
    .pipe(cached('less'))
    .pipe(less())
    .pipe(autoprefixer('last 6 version'))
    .pipe(gulp.dest('src'));
});



//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//编译lessEclipse——方便与开发联调，发布到tomcat和eclipse相应项目目录中
gulp.task('lessEclipse', function() {
    return gulp.src('src/cssEclispe/*.less',{base:'./src'})
    .pipe(cached('less'))
    .pipe(less())
    .pipe(autoprefixer('last 6 version'))
    .pipe(gulp.dest('src'));
});

gulp.task('distCopyEclipse',function(){
    return gulp.src('src/cssEclispe/*',{nodir:true})
    .pipe(cached('distCopyEclipse'))
    .pipe(gulp.dest('D:/workSpace/makerplateform/webapp/instantcommunication/theme/css'))
    .pipe(gulp.dest('D:/tomcat7/webapps/makerplateform/instantcommunication/theme/css'));
});
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||





//distCopy
gulp.task('distCopy',function(){
    return gulp.src('src/**/*',{base:'./src'})
    .pipe(cached('distCopy'))
    .pipe(gulp.dest('dist'));
});

//图片压缩
gulp.task('imgmin', function() {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}',{base:'./src'})
    .pipe(cached('imgmin'))
    // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
    .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true, multipass: true}))
    .pipe(gulp.dest('dist'));
});

//css压缩
gulp.task('cssmin', function() {
    return gulp.src(['src/**/*.css','!src/**/*.min.css','!src/lib/**/*.css'],{base:'./src'})
    .pipe(cached('cssmin'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

//jsmin
gulp.task('jsmin', function() {
    return gulp.src(['src/js/*.js','!src/js/*.min.js'],{base:'./src'})
    .pipe(cached('jsmin'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

//发布任务
gulp.task('distMin', 
    gulp.series('lessLocal','distCopy',
        gulp.parallel('imgmin','cssmin','jsmin')
    )
);
gulp.task('distUnMin', 
    gulp.series('distCopy',
        gulp.parallel('imgmin')
    )
);


//---------------------- server  tasks-------------------------
//浏览器刷新    
gulp.task('default', function() {  
    browserSync.init({  
        //指定服务器启动根目录
        server: "./src"
    });  
    // gulp.watch('src/css/*.less',gulp.series('lessLocal'));
    gulp.watch('src/cssEclispe/*.less',gulp.series('lessEclipse','distCopyEclipse'));
    gulp.watch("./src/**/*.*").on('change',browserSync.reload);
});