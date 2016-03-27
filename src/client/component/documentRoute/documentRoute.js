define('documentRoute/documentRoute', [
    'styler',
    'text!documentRoute/documentRoute.css',
    'text!documentRoute/documentRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhDocumentRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.documentId = $route.current.params.documentId;
                    }]
                };
            });
    }
});