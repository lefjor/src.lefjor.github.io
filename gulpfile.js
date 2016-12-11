/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require("gulp-minify-css"),
    imagemin = require("gulp-imagemin"),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    uncss = require('gulp-uncss');
wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Tâche "critical" = critical inline CSS
gulp.task('critical', function () {
    return gulp.src(prod + '/*.html')
        .pipe(critical({
            base: prod,
            inline: true,
            width: 320,
            height: 480,
            minify: true
        }))
        .pipe(gulp.dest(prod));
});

gulp.task('default', ['build-css', 'build-html', 'build-img', 'build-ico']);

gulp.task('serve', ['watch']);

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
        .pipe(uncss({
            html: ['src/*.html']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-bootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(uncss({html: ['src/*.html']}))
        .pipe(gulp.dest('dist/css'));
});

// Minify HTML and copy to dist
gulp.task('build-html', ['copy-bootstrap', 'build-css'], function () {
    var injectFiles = gulp.src(['dist/css/**/*.css']);

    var injectOptions = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src('src/*.html')
        .pipe(inject(injectFiles, injectOptions))
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist'));
});

//Minify png and copy to dist/img
gulp.task('build-img', function () {
    return gulp.src('src/img/**/*.png')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('dist/img'));
});

// copy ico
gulp.task('build-ico', function () {
    return gulp.src(['src/img/**/*.ico'])
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/scss/**/*.scss', ['build-css']);
    gulp.watch('src/*.html', ['build-html']);
    gulp.watch('src/img/**/*.png', ['build-img']);
    gulp.watch('src/img/**/*.ico', ['build-ico']);

    gulp.watch('./dist/css/**/*.css', reload);
    gulp.watch('./dist/*.html', reload);
    gulp.watch('./dist/img/**/*.png', reload);
    gulp.watch('./dist/img/**/*.ico', reload);
});