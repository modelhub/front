define('service/nav', [
], function(
){
    return function(ngModule){
        ngModule
            .service('nav', ['$rootScope', '$window', function($rootScope, $window){
                function nav(base) {
                    var path = '/#/'+base;
                    for (var i = 1; i < arguments.length; i++){
                        if (arguments[i] && arguments[i].length) {
                            path += '/' + encodeURIComponent(arguments[i]);
                        }
                    }
                    $window.location.assign(path);
                }
                return {
                    goToUser: function(id){nav('user', id)},
                    goToProject: function(id){nav('project', id)},
                    goToFolder: function(id){nav('folder', id)},
                    goToDocument: function(id){nav('document', id)},
                    goToDocumentVersion: function(id){nav('documentVersion', id)},
                    goToSearch: function(search, project){nav('search', search, project)},
                    goToUploads: function(){nav('uploads')}
                };
            }]);
    };
});