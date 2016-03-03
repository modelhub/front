define('registry', [
    'ng',
    //services
    'service/api',
    'service/i18n',
    'service/lmvLoader',
    //components
    'langSelector/langSelector',
    'loader/loader',
    'rootLayout/rootLayout',
    'viewer/viewer'
], function(
    ng,
    //services
    api,
    i18n,
    lmvLoader,
    //components
    langSelector,
    loader,
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