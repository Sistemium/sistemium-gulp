const gulp = require('gulp');
const filter = require('gulp-filter');
const useref = require('gulp-useref');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const uglifySaveLicense = require('uglify-save-license');
const inject = require('gulp-inject');
const ngAnnotate = require('gulp-ng-annotate');
const replace = require('gulp-replace');
const manifest = require('gulp-manifest');
const del = require('del');
const through = require('through2');
const utimes = require('fs').utimes;
const pipe = require('gulp-pipe');
const _ = require('lodash');
const identity = require('gulp-uglify');

const conf = require('../conf/gulp.conf');

// const webkitAssign = require('webkit-assign/gulp');

gulp.task('build:finish', finishBuild);

function finishBuild() {

  const partialsInjectFile = gulp.src(conf.path.tmp('templateCacheHtml.js'), {read: false});
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.tmp,
    addRootSlash: false
  };

  const htmlFilter = filter(conf.path.tmp('*.html'), {restore: true});
  const jsFilter = filter(conf.path.tmp('**/*.js'), {restore: true});
  const cssFilter = filter(conf.path.tmp('**/*.css'), {restore: true});

  var touch = through.obj(function (file, enc, done) {
    var now = new Date;
    utimes(file.path, now, now, done);
  });

  var cssReplace = [replace('fonts/bootstrap/', '../fonts/')];

  Array.prototype.push.apply(
    cssReplace,
    _.map(_.get(conf, 'build.replace.css'), (val, key) => replace(key, val))
  );

  var jsReplace = [identity()];

  Array.prototype.push.apply(
    jsReplace,
    _.map(_.get(conf, 'build.replace.js'), (val, key) => replace(key, val))
  );

  function preservator(name, comments) {
    return uglifySaveLicense(name, comments);
      // || /^.*Click$/.test(name);
  }

  var uglifyOptions = _.assign(
    {preserveComments: preservator},
    _.get(conf, 'build.uglify') || {}
  );

  return gulp.src(conf.path.tmp('/index.html'))
    .pipe(replace('data-manifest=', 'manifest='))
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
    .pipe(useref())
    .pipe(jsFilter)
    // .pipe(webkitAssign())
    // .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(pipe(jsReplace))
    .pipe(uglify(uglifyOptions)).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    // .pipe(sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(pipe(cssReplace))
    // .pipe(sourcemaps.init())
    .pipe(cssnano({
      zindex: false
    }))
    .pipe(rev())
    // .pipe(sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(htmlmin())
    .pipe(replace('<script src=', '<script charset="utf-8" src='))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(conf.path.dist()))
    .pipe(filter(conf.path.dist('index.html')))
    .pipe(touch);
}

gulp.task('manifest', () =>

  gulp.src(conf.path.dist('/**/*'))
    .pipe(manifest({
      hash: true,
      preferOnline: false,
      network: ['*'],
      filename: 'app.manifest',
      exclude: ['app.manifest']
    }))
    .pipe(gulp.dest(conf.path.dist()))
);

gulp.task('build:cleanup', ()=>
  del(`${conf.paths.tmp}/templateCacheHtml.js`)
);
