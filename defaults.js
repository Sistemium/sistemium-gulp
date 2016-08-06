var storedDefaults = {
  base: ''
};

export default storedDefaults;
export {setDefaults};

function setDefaults(defaults, gulp) {
  Object.assign(storedDefaults, defaults || {});
  storedDefaults.gulp = gulp;
  console.info('set defaults', storedDefaults);
}

console.info('required defaults');
