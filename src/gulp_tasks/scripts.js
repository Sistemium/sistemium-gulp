const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const conf = require('../conf/gulp.conf');

gulp.task('scripts', scripts);
gulp.task('json', json);

function scripts() {
  return gulp.src(conf.path.src('**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())

    .pipe(babel())
    .pipe(gulp.dest(conf.path.tmp()));
}

function json() {
  return gulp.src(conf.path.src('**/*.json'))
    .pipe(gulp.dest(conf.path.tmp()));
}
