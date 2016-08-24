# sistemium-gulp

![Downloads](https://img.shields.io/npm/dm/sistemium-gulp.svg)
![Downloads](https://img.shields.io/npm/dt/sistemium-gulp.svg)
![npm version](https://img.shields.io/npm/v/sistemium-gulp.svg)
![dependencies](https://img.shields.io/david/Sistemium/sistemium-gulp.svg)
![dev dependencies](https://img.shields.io/david/dev/Sistemium/sistemium-gulp.svg)
![License](https://img.shields.io/npm/l/sistemium-gulp.svg)

Module for building Angular client projects

## Getting Started

Install it via npm:

```shell
npm install sistemium-gulp --save-dev
```

### Add gulpfile.js to your project:

```javascript
require('sistemium-gulp')
  .config({
    ngModule: 'yourProjectMainModule'
  })
  .run(require('gulp'));
```

### Add .babelrc to your project:

```
{
  "presets": ["es2015"]
}
```

## License

ISC
