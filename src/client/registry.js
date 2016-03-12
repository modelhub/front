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
    'invites/invites',
    'langSelector/langSelector',
    'loader/loader',
    'logout/logout',
    'mainMenu/mainMenu',
    'projects/projects',
    'rootLayout/rootLayout',
    'search/search',
    'settings/settings',
    'uploads/uploads',
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
    logoutService,
    //components
    aggregationViewer,
    invites,
    langSelector,
    loader,
    logout,
    mainMenu,
    projects,
    rootLayout,
    search,
    settings,
    uploads,
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