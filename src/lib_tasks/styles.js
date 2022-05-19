const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpInject = require('gulp-inject');
const importOnce = require('node-sass-import-once');
const concat = require ('gulp-concat-util');
const conf = require('../conf/gulp.conf');
const replace = require('gulp-replace');
const pipe = require('gulp-pipe');
import _ from 'lodash';

gulp.task('styles', styles);

function styles() {

  const sassOptions = {
    includePaths: conf.styles.includePaths || [],
    // outputStyle: 'expanded',
    importer: importOnce
  };

  const injectFiles = gulp.src([
    conf.path.src(conf.styles.src + '/**/*.scss')
  ], { read: false });

  const injectOptions = {
    transform: function (filePath) {
      // filePath = filePath.replace(/^\/app\//, '/');
      return `@import "${filePath}";`;
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  const replaceStyles = conf.styles.replace;

  const cssReplace = _.map(replaceStyles, parts => replace.apply(this, parts));

  return gulp.src([
    conf.path.src(conf.styles.index || 'index.scss')
  ])
    .pipe(gulpInject(injectFiles, injectOptions))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(concat(conf.styles.concat || 'index.css'))
    .pipe(pipe(cssReplace))
    .pipe(gulp.dest(conf.path.dist()));

}
