define('documentVersionRoute/documentVersionRoute', [
    'styler',
    'text!documentVersionRoute/documentVersionRoute.css',
    'text!documentVersionRoute/documentVersionRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhDocumentVersionRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.documentVersionId = $route.current.params.documentVersionId;
                    }]
                };
            });
    }
});