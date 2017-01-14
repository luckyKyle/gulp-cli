/ 引入 gulp及组件
var gulp=require('gulp'),  //gulp基础库
    minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    jshint=require('gulp-jshint'),   //js检查
    notify=require('gulp-notify');   //提示

gulp.task('default',function(){
    gulp.start('minifycss','minifyjs');
});
 
//css处理
gulp.task('minifycss',function(){
   return gulp.src('htdocs/kunpeng/static/css/*.css')      //设置css
       .pipe(concat('order_query.css'))      //合并css文件到"order_query"
       .pipe(gulp.dest('dist/styles'))           //设置输出路径
       .pipe(rename({suffix:'.min'}))         //修改文件名
       .pipe(minifycss())                    //压缩文件
       .pipe(gulp.dest('dist/styles'))            //输出文件目录
       .pipe(notify({message:'css task ok'}));   //提示成功
});

//JS处理
gulp.task('minifyjs',function(){
   return gulp.src(['/static/js/juicer-min.js','/static/js/bootstrap.min.js','/static/js/bootstrap-datetimepicker.min.js','/static/js/order_query.js'])  //选择合并的JS
       .pipe(concat('order_query.js'))   //合并js
       .pipe(gulp.dest(''dist/js'))         //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('dist/js'))            //输出 
       .pipe(notify({message:"js task ok"}));    //提示
});