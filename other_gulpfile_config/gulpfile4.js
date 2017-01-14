'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000", // 这里要换成你在express中开的服务端口 一般是3000
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});
gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'app.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true; 
        } 
    });
});