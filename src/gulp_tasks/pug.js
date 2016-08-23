const gulp = require('gulp');
const conf = require('../conf/gulp.conf');
const pug = require('gulp-pug');

gulp.task('pug', function () {
  return gulp.src(conf.paths.views)
    .pipe(pug({
      pretty: true,
      doctype: 'html'
    }))
    .pipe(gulp.dest('.tmp/app'));
});
