var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('lib', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('dev', function() {
  return browserify('./src/core.js',{
        standalone: 'Flow'
    })
    .transform(babelify)
    .bundle()
    .pipe(source('flow.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist', function() {
  return browserify('./src/core.js',{
        standalone: 'Flow'
    })
    .transform(babelify)
    .bundle()
    .pipe(source('flow.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['dev','dist','lib']);
