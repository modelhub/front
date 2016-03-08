define('registry', [
    'ng',
    //constants
    'constant/event',
    //services
    'service/api',
    'service/currentUser',
    'service/i18n',
    'service/lmv',
    'service/lmvLoader',
    'service/nav',
    //components
    'document/document',
    'documentVersion/documentVersion',
    'folder/folder',
    'header/header',
    'langSelector/langSelector',
    'loader/loader',
    'project/project',
    'rootLayout/rootLayout',
    'search/search',
    'uploads/uploads',
    'user/user',
    'viewer/viewer'
], function(
    ng,
    //constants
    EVENT,
    //services
    api,
    currentUser,
    i18n,
    lmv,
    lmvLoader,
    nav,
    //components
    document,
    documentVersion,
    folder,
    header,
    langSelector,
    loader,
    project,
    rootLayout,
    search,
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