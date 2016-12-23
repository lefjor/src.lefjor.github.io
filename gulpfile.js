/* File: gulpfile.js */
var config = require('./gulp.config');
var args = require('yargs').argv;
var del = require('del');
var runSeq = require('run-sequence');
var gulp = require('gulp'),
    pngquant = require('imagemin-pngquant');
var critical = require('critical');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')({lazy: true});

var env = args.env ? 'prod' : 'dev';
var isProd = args.env === 'prod';

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);

/**
 * Build all the project with dev or prod environnement
 */
gulp.task('build',
    function () {
        $.util.log('Environnement : ' + $.util.colors.blue(args.env));
        runSeq('clean:dist', 'build:bootstrap', 'build:css', ['build:img', 'build:ico', 'build:humans'], 'build:html', 'critical');
    });

/**
 * Default task to launch the project
 */
gulp.task('default', function () {
    $.util.log('Environnement : ' + $.util.colors.blue(args.env));
    runSeq('clean:dist', 'build:bootstrap', 'build:css', ['build:img', 'build:ico', 'build:humans'], 'build:html', 'critical', 'watch');
});

/**
 * Critical CSS generation
 */
gulp.task('critical', function () {
    $.if(isProd,
        critical.generate({
            inline: true,
            base: 'dist/',
            src: 'index.html',
            dest: 'index.html',
            width: 320,
            height: 480,
            minify: true
        }));
});

/**
 * Remove all files from the build
 */
gulp.task('clean:dist', function () {
    var delconfig = [].concat(config.build);
    $.util.log('Cleaning: ' + $.util.colors.blue(delconfig));
    return del.sync(delconfig);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

/**
 * Search Bootstrap to include in index.html
 */
gulp.task('build:bootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe($.if(isProd, $.uncss({html: ['src/*.html']})))
        .pipe(gulp.dest('dist/css'));
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('build:css', function () {
    $.util.log('Compiling Sass --> CSS');

    return gulp.src(config.directory.sass)
        .pipe($.sass({errLogToConsole: true}))
        .pipe($.plumber())
        .pipe($.if(!isProd, $.sourcemaps.init()))
        .pipe($.if(isProd, $.uncss({
            html: ['src/*.html']
        })))
        .pipe($.if(isProd, $.rename({
            suffix: '.min'
        })))
        .pipe($.if(isProd, $.autoprefixer()))
        .pipe($.if(isProd, $.csso()))
        //.pipe($.if(isProd, $.filter))
        .pipe($.if(!isProd, $.sourcemaps.write('.', {includeContent: false, sourceRoot: 'src/scss'})))
        //.pipe($.if(isProd, $.filter.restore))
        .pipe(gulp.dest('dist/css'));
});

/**
 * Build, optimize img
 */
gulp.task('build:img', function () {
    return gulp.src(config.directory.srcImg)
        .pipe($.newer(config.directory.distImg))
        .pipe($.if(isProd, $.imagemin({
            optimizationLevel: 7,
            interlaced: true,
            progressive: true,
            use: [pngquant()]
        })))
        .pipe(gulp.dest(config.directory.distImg));
});

/**
 * Build, optimize ico
 */
gulp.task('build:ico', function () {
    return gulp.src(config.directory.srcIco)
        .pipe($.changed(config.directory.distImg))
        .pipe(gulp.dest(config.directory.distImg));
});

/**
 * Build humans.txt
 */
gulp.task('build:humans', function () {
    return gulp.src(config.directory.srcHumans)
        .pipe($.changed(config.directory.distHumans))
        .pipe(gulp.dest(config.directory.distHumans));
});

/**
 * Build, optimize and inject style with HTML files
 */
gulp.task('build:html', function () {
    var injectFiles = gulp.src('dist/css/**/*.css');
    $.util.log("injectFiles " + injectFiles);

    var injectOptions = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src(config.directory.srcHtml)
        .pipe($.inject(injectFiles, injectOptions))
        .pipe($.if(isProd, $.htmlmin({collapseWhitespace: true, minifyJS: true, removeComments: true})))
        .pipe(gulp.dest(config.build));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(config.directory.sass, ['build:css']);
    gulp.watch(config.directory.srcHtml, ['build:html']);
    gulp.watch(config.directory.srcImg, ['build:img']);
    gulp.watch(config.directory.srcIco, ['build:ico']);

    gulp.watch(['./dist/css/**/*.css', './dist/*.html', './dist/img/**/*.png', './dist/img/**/*.ico'], browserSync.reload);
});
