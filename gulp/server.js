'use strict';

var path = require('path');
var conf = require('./conf');
var gulp = conf.gulp;
var runSequence = require('run-sequence');

var $ = conf.plugins;

import browserSyncInit from './browserSyncInit';

gulp.task('clean:tmp', function(){
  return gulp.src(conf.paths.tmp, {read: false})
    .pipe($.clean());
});


gulp.task('serve', function () {
  runSequence.use(gulp)(
    'clean:tmp',
    'watch',
    ()=> {browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);}
  );
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
