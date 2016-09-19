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

const conf = require('../conf/gulp.conf');

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

  return gulp.src(conf.path.tmp('/index.html'))
    .pipe(replace('data-manifest=', 'manifest='))
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
    .pipe(useref())
    .pipe(jsFilter)
    // .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    // TODO: make configurable replace
    .pipe(replace('\'//api-maps.yandex.ru', '\'http://api-maps.yandex.ru'))
    .pipe(uglify({preserveComments: uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    // .pipe(sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(pipe(cssReplace))
    // .pipe(sourcemaps.init())
    .pipe(cssnano())
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
