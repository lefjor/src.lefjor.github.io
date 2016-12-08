/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require("gulp-minify-css"),
    minifyImg = require("gulp-imagemin");
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

config: {
    browsersync: {
        watch: [
            './dist/assets/scripts/**/*.js',
            './dist/assets/css/**/*.css',
            './dist/*.html'
        ]
    }
};

gulp.task('default', ['watch']);

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    //gulp.watch(config.browsersync.watch).on('change', reload);
});

// SCSS + SourceMaps + minify to CSS
gulp.task('build-css', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/assets/css'));
});

// Minify HTML and copy to dist
gulp.task('build-html', function () {
    return gulp.src('./*.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist'));
});

//Minify png and copy to dist/assets/img
gulp.task('build-img', function () {
    return gulp.src('src/img/**/*.png')
        .pipe(minifyImg({progressive: true}))
        .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/scss/**/*.scss', ['build-css']);
    gulp.watch('./*.html', ['build-html']);
    gulp.watch('src/img/**/*.png', ['build-img']);

    gulp.watch('./dist/assets/css/**/*.css', reload);
    gulp.watch('./dist/*.html', reload);
    gulp.watch('./dist/assets/img/**/*.png', reload);
});