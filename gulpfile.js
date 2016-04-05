var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  return gulp.src([
      'src/schema.js',
      'src/components.js',
      'src/event.js',
      'src/template.js',
      'src/model.js'
    ])
    .pipe(concat('schema.js'))
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['scripts']);
