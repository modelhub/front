define('searchRoute/searchRoute', [
    'styler',
    'text!searchRoute/searchRoute.css',
    'text!searchRoute/searchRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhSearchRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.project = $route.current.params.project;
                        $scope.search = $route.current.params.search;
                    }]
                };
            });
    }
});