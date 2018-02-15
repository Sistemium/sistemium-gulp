const path = require('path');
const gulp = require('gulp');
const conf = require('../conf/gulp.conf');
const replace = require('gulp-replace');
const pipe = require('gulp-pipe');
const rename = require("gulp-rename")

import _ from 'lodash';

let {others} = conf;

let tasks = _.map(others, (paths, key) => {

  let {from = paths[0], to = paths[1], replaces} = paths;
  let task = `other_${key}`;

  console.log('Replace: ', key, from, to, replaces);

  gulp.task(task, () => {

    const replaceOther = _.map(replaces, parts => replace.apply(this, parts));

    let res = gulp.src(from);

    if (replaceOther.length) {
      res = res.pipe(pipe(replaceOther));
    }

    return res.pipe(rename({
      dirname:''
    }))
      .pipe(gulp.dest(path.join(conf.paths.dist, to)));

  });

  return task;

});

console.log(tasks);

gulp.task('others', tasks.length ? gulp.series(tasks) : _.result);
