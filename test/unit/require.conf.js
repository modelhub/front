var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/test\/unit\/tests\/component\/.*\.js$/.test(file) || /test\/unit\/tests\/service\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    baseUrl: '/base/src/client/component',
    paths: {
        ng: '../lib/angular/angular',
        ngRoute: '../lib/angular-route/angular-route',
        d3: '../lib/d3/d3',
        drs: '../lib/drag-resize-snap.js',
        c3: '../lib/c3/c3',
        moment: '../lib/moment/min/moment-with-locales',
        interact : '../lib/interact/interact',
        text: '../lib/requirejs-text/text',
        registry: '../registry',
        service: '../service',
        styler: '../styler',
        topLevelCss: '../topLevel.css',
        ngMock: '../lib/angular-mocks/angular-mocks',
    },
    shim: {
        ng: {
            exports: 'angular'
        },
        ngMock:{
            deps: ['ng']
        },
        drs: {'exports' : 'drs'}
    },
    deps: tests,
    callback: window.__karma__.start
});