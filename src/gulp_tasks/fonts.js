const gulp = require('gulp');
const filter = require('gulp-filter');
const flatten = require('gulp-flatten');
const mainBowerFiles = require('gulp-main-bower-files');
const conf = require('../conf/gulp.conf');

gulp.task('fonts', function () {
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(flatten())
    .pipe(gulp.dest(conf.path.dist('/fonts')));
});
