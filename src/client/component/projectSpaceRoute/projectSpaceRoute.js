define('projectSpaceRoute/projectSpaceRoute', [
    'styler',
    'text!projectSpaceRoute/projectSpaceRoute.css',
    'text!projectSpaceRoute/projectSpaceRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpaceRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.projectSpaceId = $route.current.params.projectSpaceId;
                    }]
                };
            });
    }
});