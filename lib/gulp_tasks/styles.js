'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var gulpInject = require('gulp-inject');
var importOnce = require('node-sass-import-once');

var conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

function styles() {

  var sassOptions = {
    outputStyle: 'expanded',
    importer: importOnce
    // ,
    // importOnce: {
    //   index: false,
    //   css: false,
    //   bower: false
    // }
  };

  var injectFiles = gulp.src([conf.path.src('app/**/*.scss')]);

  var injectOptions = {
    transform: function transform(filePath) {
      // filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src([conf.path.src('index.scss')]).pipe(gulpInject(injectFiles, injectOptions)).pipe(sourcemaps.init()).pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')).pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer')).pipe(sourcemaps.write()).pipe(gulp.dest(conf.path.tmp())).pipe(browserSync.stream());
}