define('registry', [
    'ng',
    //services
    'service/i18n',
    'service/lmvLoader',
    'service/api',
    //components
    'langSelector/langSelector',
    'loader/loader',
    'rootLayout/rootLayout',
    'viewer/viewer'
], function(
    ng,
    //services
    i18n,
    lmvLoader,
    api,
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