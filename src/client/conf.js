require.config({
    baseUrl: 'component',
    paths: {
        'ng': '../lib/angular/angular',
        'ngRoute': '../lib/angular-route/angular-route',
        'moment': '../lib/moment/min/moment-with-locales',
        'text': '../lib/requirejs-text/text',
        'registry': '../registry',
        'service': '../service',
        'styler': '../styler',
        'topLevelCss': '../topLevel.css'
    },
    shim: {
        ng: {
            exports: 'angular'
        },
        ngRoute: {
            deps: ['ng'],
            exports: 'angular'
        },
        'moment': {
            exports: 'moment'
        }
    }
});