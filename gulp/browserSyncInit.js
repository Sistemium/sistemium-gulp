export default browserSyncInit;

var conf = require('./conf');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var util = require('util');


browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

//import proxyMiddleware from 'http-proxy-middleware';

function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
        routes = {
            '/bower_components': 'bower_components'
        };
    }

    var server = {
        baseDir: baseDir,
        routes: routes
    };

    /*
     * You can add a proxy to your backend by uncommenting the line below.
     * You just have to configure a context which will we redirected and the target url.
     * Example: $http.get('/users') requests will be automatically proxified.
     *
     * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
     */
    // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser,
        ui: false,
        port: 3000,
        logFileChanges: false,
        ghostMode: false // set true to sync user actions across browsers
    });
}
