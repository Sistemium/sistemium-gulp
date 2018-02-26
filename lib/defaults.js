'use strict';

var storedDefaults = {
  browserSync: {},
  styles: {
    includePaths: ['src/app/styles']
  }
};

exports.setDefaults = setDefaults;
exports.defaults = storedDefaults;

function setDefaults(defaults) {
  Object.assign(storedDefaults, defaults || {});
  console.info('Use config:', JSON.stringify(storedDefaults, null, 2));
  return storedDefaults;
}