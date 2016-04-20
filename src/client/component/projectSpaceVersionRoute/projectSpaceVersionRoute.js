define('projectSpaceVersionRoute/projectSpaceVersionRoute', [
    'styler',
    'text!projectSpaceVersionRoute/projectSpaceVersionRoute.css',
    'text!projectSpaceVersionRoute/projectSpaceVersionRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpaceVersionRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.projectSpaceVersionId = $route.current.params.projectSpaceVersionId;
                    }]
                };
            });
    }
});