const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

function styles() {

  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src([
    // conf.path.src('index.scss'),
    conf.path.src('app/**/*.scss')
  ]);

  var injectOptions = {
    transform: function(filePath) {
      // filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };



  return gulp.src([
    conf.path.src('index.scss')
  ])
    .pipe(gulpInject(injectFiles, injectOptions))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'})).on('error', conf.errorHandler('Sass'))
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
    // .pipe(wiredep(Object.assign({}, conf.wiredep)))
    // .pipe($.rubySass(sassOptions)).on('error', conf.errorHandler('RubySass'))
    // .pipe(cssFilter)
    // .pipe($.sourcemaps.init({ loadMaps: true }))
    // .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    // .pipe($.sourcemaps.write())
    // .pipe(cssFilter.restore)
    // .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
}
