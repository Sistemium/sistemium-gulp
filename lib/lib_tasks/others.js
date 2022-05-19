'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var gulp = require('gulp');
var conf = require('../conf/gulp.conf');
var replace = require('gulp-replace');
var pipe = require('gulp-pipe');
var rename = require("gulp-rename");

var others = conf.others;


var tasks = _lodash2.default.map(others, function (paths, key) {
  var _paths$from = paths.from,
      from = _paths$from === undefined ? paths[0] : _paths$from,
      _paths$to = paths.to,
      to = _paths$to === undefined ? paths[1] : _paths$to,
      replaces = paths.replaces,
      _paths$flatten = paths.flatten,
      flatten = _paths$flatten === undefined ? true : _paths$flatten;

  var task = 'other_' + key;

  if (paths.length > 2) {
    flatten = paths[2];
  }

  console.log('Replace: ', key, from, to, replaces);

  gulp.task(task, function () {

    var replaceOther = _lodash2.default.map(replaces, function (parts) {
      return replace.apply(undefined, parts);
    });

    var res = gulp.src(from);

    if (replaceOther.length) {
      res = res.pipe(pipe(replaceOther));
    }

    var renameConf = {};

    if (flatten) {
      renameConf.dirname = '';
    }

    return res.pipe(rename(renameConf)).pipe(gulp.dest(path.join(conf.paths.dist, to)));
  });

  return task;
});

console.log(tasks);

gulp.task('others', tasks.length ? gulp.series(tasks) : function (done) {
  return done();
});