/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyHtml = require('gulp-minify-html'),
    cleanCss = require("gulp-minify-css"),
    imagemin = require("gulp-imagemin"),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    uncss = require('gulp-uncss'),
    pngquant = require('imagemin-pngquant'),
    inlineCss = require('gulp-inline-css'),
    changed = require('gulp-changed'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-rimraf');
gutil = require('gulp-util');
var critical = require('critical').stream;
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Tâche "critical" = critical inline CSS
gulp.task('critical', function () {
    return gulp.src('dist/*.html')
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'copy-bootstrap', 'build-css', 'build-img', 'build-ico', 'build-humans', 'build-html']);

gulp.task('serve', ['watch']);

gulp.task('prod', ['prod-build-css', 'prod-copy-bootstrap', 'prod-build-html', 'critical', 'build-img', 'build-ico', 'build-humans']);

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

// SCSS + SourceMaps + minify to CSS
gulp.task('prod-build-css', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(uncss({
            html: ['src/*.html']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

// SCSS + SourceMaps + minify to CSS
gulp.task('build-css', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('clean', [], function () {
    console.log("Clean all files in build folder");
    return gulp.src("dist/*", {read: false}).pipe(clean());
});

gulp.task('prod-copy-bootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(uncss({html: ['src/*.html']}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-bootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build-humans', function () {
    const dest = 'dist/assets/txt/';

    return gulp.src('src/assets/txt/**/*.txt')
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
});

// Minify HTML and copy to dist
gulp.task('build-html', ['copy-bootstrap', 'build-css'],function () {
    var injectFiles = gulp.src(['dist/css/**/*.css']);

    var injectOptions = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src('src/*.html')
        .pipe(inject(injectFiles, injectOptions))
        .pipe(gulp.dest('dist'));
});

// Minify HTML and copy to dist
gulp.task('prod-build-html', ['prod-copy-bootstrap', 'prod-build-css'],function () {
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

//Minify img and copy to dist/img
gulp.task('build-img', function () {
    var imgDst = 'dist/img';
    return gulp.src('src/img/**/*.+(png|jpg|gif)')
        .pipe(changed(imgDst))
        .pipe(imagemin({progressive: true, use: [pngquant()]}))
        .pipe(gulp.dest(imgDst));
});

// copy ico
gulp.task('build-ico', function () {
    const dest = 'dist/img';
    return gulp.src(['src/img/**/*.ico'])
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/scss/**/*.scss', ['build-css']);
    gulp.watch('src/*.html', ['build-html']);
    gulp.watch('src/img/**/*.png', ['build-img']);
    gulp.watch('src/img/**/*.ico', ['build-ico']);

    gulp.watch(['./dist/css/**/*.css', './dist/*.html', './dist/img/**/*.png', './dist/img/**/*.ico'], reload);
});