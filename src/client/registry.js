define('registry', [
    'ng',
    //services
    'service/currentUser',
    'service/documents',
    'service/i18n',
    'service/lmvLoader',
    'service/sheetExtractor',
    //components
    'document/document',
    'documents/documents',
    'header/header',
    'langSelector/langSelector',
    'loader/loader',
    'rootLayout/rootLayout',
    'settings/settings',
    'viewer/viewer'
], function(
    ng,
    //services
    c3,
    currentUser,
    documentsService,
    i18n,
    lmvLoader,
    sheetExtractor,
    //components
    document,
    documents,
    header,
    langSelector,
    loader,
    rootLayout,
    settings,
    viewer
){
    var registry = ng.module('cp.registry', []);
    [].slice.call(arguments).forEach(function(arg){
        if(arg !== ng){
            arg(registry);
        }
    });

    return registry;
});