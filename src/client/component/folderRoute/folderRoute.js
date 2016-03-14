define('folderRoute/folderRoute', [
    'styler',
    'text!folderRoute/folderRoute.css',
    'text!folderRoute/folderRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhFolderRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.folderId = $route.current.params.folderId;
                    }]
                };
            });
    }
});