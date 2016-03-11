define('registry', [
    'ng',
    //constants
    'constant/event',
    //services
    'service/api',
    'service/csrfToken',
    'service/currentUser',
    'service/i18n',
    'service/lmv',
    'service/lmvLoader',
    'service/logout',
    //components
    'aggregationViewer/aggregationViewer',
    'langSelector/langSelector',
    'loader/loader',
    'mainMenu/mainMenu',
    'rootLayout/rootLayout',
    'viewer/viewer'
], function(
    ng,
    //constants
    EVENT,
    //services
    api,
    csrfToken,
    currentUser,
    i18n,
    lmv,
    lmvLoader,
    logout,
    //components
    aggregationViewer,
    langSelector,
    loader,
    mainMenu,
    rootLayout,
    viewer
){
    var registry = ng.module('mh.registry', []);
    [].slice.call(arguments).forEach(function(arg){
        if(arg !== ng){
            arg(registry);
        }
    });

    return registry;
});