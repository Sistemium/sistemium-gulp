const gulp = require('gulp');
const wiredep = require('wiredep').stream;
const angularFilesort = require('gulp-angular-filesort');
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
  const injectScripts = gulp.src([
    conf.path.tmp('**/*.js'),
    `!${conf.path.tmp('**/*.spec.js')}`,
    `!${conf.path.tmp('templateCacheHtml.js')}`
  ])
  .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  const injectOptions = {
    ignorePath: [conf.paths.src, conf.paths.tmp],
    addRootSlash: false
  };

  return gulp.src(conf.path.src('index.html'))
    .pipe(gulpInject(injectScripts, injectOptions))
    .pipe(wiredep(Object.assign({}, conf.wiredep)))
    .pipe(gulp.dest(conf.paths.tmp));
}
