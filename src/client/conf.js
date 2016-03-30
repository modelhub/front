require.config({
    baseUrl: 'component',
    paths: {
        'ng': '../lib/angular/angular',
        'ngRoute': '../lib/angular-route/angular-route',
        'moment': '../lib/moment/moment',
        'momentLocale': '../lib/moment/locale',
        'text': '../lib/requirejs-text/text',
        'markdown': '../lib/markdown/markdown',
        'registry': '../registry',
        'service': '../service',
        'constant': '../constant',
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
        },
        'markdown': {
            exports: 'markdown'
        }
    }
});