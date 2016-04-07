var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('lib', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('dist', function() {
  return browserify('./src/Schema.js',{
        standalone: 'Schema'
    })
    .transform(babelify)
    .bundle()
    .pipe(source('schema.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['dist']);
