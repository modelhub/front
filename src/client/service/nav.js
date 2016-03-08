define('service/nav', [
], function(
){
    return function(ngModule){
        ngModule
            .service('nav', ['$rootScope', '$window', 'EVENT', function($rootScope, $window, EVENT){
                function nav(base) {
                    if(!arguments[1] || !arguments[1].length){
                        throw "baseArg must be a none empty string";
                    } else {
                        var path = '/#/'+base;
                        for (var i = 1; i < arguments.length; i++){
                            if (arguments[i] && arguments[i].length) {
                                path += '/' + encodeURIComponent(arguments[i]);
                            }
                        }
                        $rootScope.$broadcast(EVENT.NAVIGATING);
                        $window.location.assign(path);
                    }
                }
                return {
                    goToUser: function(id){nav('user', id)},
                    goToProject: function(id){nav('project', id)},
                    goToFolder: function(id){nav('folder', id)},
                    goToDocument: function(id){nav('document', id)},
                    goToDocumentVersion: function(id){nav('documentVersion', id)},
                    search: function(search, project){nav('search', search, project)}
                };
            }]);
    };
});