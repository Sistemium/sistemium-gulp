var storedDefaults = {
  base: ''
};

export default storedDefaults;
export {setDefaults};

function setDefaults(defaults, gulp) {
  Object.assign(storedDefaults, defaults || {});
  console.info('set defaults:', storedDefaults);
  storedDefaults.gulp = gulp;
  return storedDefaults;
}
