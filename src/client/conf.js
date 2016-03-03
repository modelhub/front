require.config({
    baseUrl: 'component',
    paths: {
        'ng': '../lib/angular/angular',
        'moment': '../lib/moment/min/moment-with-locales',
        'text': '../lib/requirejs-text/text',
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
        'moment': {
            exports: 'moment'
        }
    }
});