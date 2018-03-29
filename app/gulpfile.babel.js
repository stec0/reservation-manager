var gulp = require('gulp');
var exit = require('gulp-exit');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

function compile(watch) {
    var bundler = watchify(browserify('./static/scripts/jsx/main.js', {debug: true}).transform(babelify, {
        presets: ["env", "react"],
        plugins: ["transform-class-properties"]
    }));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(rename('main.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./static/scripts/js/'));
    }

    if (watch) {
        bundler.on('update', function () {
            console.log('-> bundling...');
            rebundle();
        });

        rebundle();
    } else {
        rebundle().pipe(exit());
    }
}

function watch() {
    return compile(true);
}

gulp.task('build', function () {
    return compile();
});
gulp.task('watch', function () {
    return watch();
});

gulp.task('default', ['watch']);
