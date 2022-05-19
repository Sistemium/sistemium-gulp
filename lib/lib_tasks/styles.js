'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var gulpInject = require('gulp-inject');
var importOnce = require('node-sass-import-once');
var concat = require('gulp-concat-util');
var conf = require('../conf/gulp.conf');
var replace = require('gulp-replace');
var pipe = require('gulp-pipe');


gulp.task('styles', styles);

function styles() {
  var _this = this;

  var sassOptions = {
    includePaths: conf.styles.includePaths || [],
    // outputStyle: 'expanded',
    importer: importOnce
  };

  var injectFiles = gulp.src([conf.path.src(conf.styles.src + '/**/*.scss')], { read: false });

  var injectOptions = {
    transform: function transform(filePath) {
      // filePath = filePath.replace(/^\/app\//, '/');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var replaceStyles = conf.styles.replace;

  var cssReplace = _lodash2.default.map(replaceStyles, function (parts) {
    return replace.apply(_this, parts);
  });

  return gulp.src([conf.path.src(conf.styles.index || 'index.scss')]).pipe(gulpInject(injectFiles, injectOptions)).pipe(sourcemaps.init()).pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')).pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer')).pipe(sourcemaps.write()).pipe(concat(conf.styles.concat || 'index.css')).pipe(pipe(cssReplace)).pipe(gulp.dest(conf.path.dist()));
}