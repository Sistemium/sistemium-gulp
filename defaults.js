var storedDefaults = {
  base: ''
};

exports.default = storedDefaults;
exports.setDefaults = setDefaults;

function setDefaults(defaults, gulp) {
  Object.assign(storedDefaults, defaults || {});
  console.info('set defaults:', storedDefaults);
  storedDefaults.gulp = gulp;
  return storedDefaults;
}
