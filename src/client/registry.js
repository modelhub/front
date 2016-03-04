define('registry', [
    'ng',
    //constants
    'constant/event',
    //services
    'service/api',
    'service/i18n',
    'service/lmvLoader',
    //components
    'header/header',
    'langSelector/langSelector',
    'loader/loader',
    'rootLayout/rootLayout',
    'user/user',
    'viewer/viewer'
], function(
    ng,
    //constants
    event,
    //services
    api,
    i18n,
    lmvLoader,
    //components
    header,
    langSelector,
    loader,
    rootLayout,
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