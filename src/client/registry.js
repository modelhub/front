define('registry', [
    'ng',
    //constants
    'constant/event',
    //services
    'service/api',
    'service/i18n',
    'service/lmv',
    'service/lmvLoader',
    'service/nav',
    //components
    'header/header',
    'langSelector/langSelector',
    'loader/loader',
    'rootLayout/rootLayout',
    'uploads/uploads',
    'user/user',
    'viewer/viewer'
], function(
    ng,
    //constants
    EVENT,
    //services
    api,
    i18n,
    lmv,
    lmvLoader,
    nav,
    //components
    header,
    langSelector,
    loader,
    rootLayout,
    uploads,
    user,
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