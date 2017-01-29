/* File: gulpfile.js */
var config = require('./gulp.config'),
    args = require('yargs').argv,
    del = require('del'),
    runSeq = require('run-sequence'),
    gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    browserify = require('browserify'),
    critical = require('critical').stream;
source = require('vinyl-source-stream'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')({lazy: true});
env = args.env ? 'prod' : 'dev',
    isProd = env === 'prod';

var pipes = {};

pipes.orderedVendorScripts = function () {
    return $.order(['angular.js']);
};

pipes.orderedAppScripts = function () {
    return $.angularFilesort();
};

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
        runSeq('clean:dist', 'build:css', ['build:img', 'build:ico', 'build:humans', 'build:svg', 'build:json', 'build:template', 'browserify'], 'build:index', 'inline:css');
    });

/**
 * Default task to launch the project
 */
gulp.task('default', function () {
    $.util.log('Environnement : ' + $.util.colors.blue(args.env));
    runSeq('clean:dist', 'build:css', ['build:img', 'build:ico', 'build:humans', 'build:svg', 'build:json', 'build:template', 'browserify'], 'build:index', 'inline:css', 'watch');
});

/**
 * Critical CSS generation
 */
gulp.task('inline:css', function () {
    return gulp.src('dist/*.html')
        .pipe($.if(isProd,
            critical({
                inline: true,
                base: 'dist/',
                dimensions: [{
                    width: 320,
                    height: 480
                }, {
                    width: 768,
                    height: 1024
                }, {
                    width: 1280,
                    height: 960
                }],
                minify: true
            })))
        .pipe(gulp.dest(config.build));
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

gulp.task('browserify', function () {
    var bundleStream = browserify('src/js/app.js').bundle();
    bundleStream
        .pipe(source('app.js'))
        .pipe($.if(isProd, $.streamify($.uglify())))
        .pipe($.rename('bundle.js'))
        .pipe(gulp.dest('dist/js'))
});

/**
 * Minify Json and copy to dist
 */
gulp.task('build:json', function () {
    return gulp.src(config.directory.srcJson)
        .pipe($.if(isProd, $.jsonmin()))
        .pipe(gulp.dest(config.directory.distJson));
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('build:css', function () {
    return gulp.src(config.directory.sass)
        .pipe($.sass({errLogToConsole: true, includePaths: './node_modules/bootstrap/scss'}))
        .pipe($.plumber())
        .pipe($.if(!isProd, $.sourcemaps.init()))
        .pipe($.if(isProd, $.uncss({
            html: ['src/**/*.html'],
            ignore: [
                new RegExp('.*reactis.*'),
                new RegExp('.*st.*'),
                new RegExp('.*icosoft.*'),
                new RegExp('.*neodoc.*')]
        })))
        .pipe($.if(isProd, $.rename({
            suffix: '.min'
        })))
        .pipe($.if(isProd, $.autoprefixer()))
        .pipe($.if(isProd, $.csso()))
        .pipe($.if(!isProd, $.sourcemaps.write('.', {includeContent: false, sourceRoot: 'src/scss'})))
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
 * Build, optimize img
 */
gulp.task('build:svg', function () {
    return gulp.src(config.directory.srcSvg)
        .pipe($.changed(config.directory.distImg))
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
gulp.task('build:index', function () {
    // CSS
    var injectFilesCss = gulp.src('dist/css/**/*.css');
    var injectOptionsCss = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    // App Scripts
    var injectFilesAppJs = gulp.src('dist/js/**/*.js');
    var injectOptionsJs = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src(config.directory.srcIndex)
        .pipe($.inject(injectFilesCss, injectOptionsCss))
        .pipe($.inject(injectFilesAppJs, injectOptionsJs))
        .pipe($.if(isProd, $.htmlmin({collapseWhitespace: true, minifyJS: true, removeComments: true})))
        .pipe(gulp.dest(config.build));
});

/**
 * Minify & build HTML template files
 */
gulp.task('build:template', function () {
    return gulp.src(config.directory.srcTemplate)
        .pipe($.if(isProd, $.htmlmin({collapseWhitespace: true, minifyJS: true, removeComments: true})))
        .pipe(gulp.dest(config.directory.distTemplate));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(config.directory.sass, ['build:css']);
    gulp.watch(config.directory.srcIndex, ['build:index']);
    gulp.watch(config.directory.srcTemplate, ['build:template']);
    gulp.watch(config.directory.srcImg, ['build:img']);
    gulp.watch(config.directory.srcIco, ['build:ico']);
    gulp.watch(config.directory.srcJs, ['browserify']);
    gulp.watch(config.directory.srcJson, ['build:json']);

    gulp.watch(['./dist/css/**/*.css', './dist/*.html', './dist/img/**/*.png', './dist/img/**/*.ico', './dist/js/**/*.js', './dist/i18n/*.json', './dist/template/**/*.html'], browserSync.reload);
});
