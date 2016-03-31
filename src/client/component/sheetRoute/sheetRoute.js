define('sheetRoute/sheetRoute', [
    'styler',
    'text!sheetRoute/sheetRoute.css',
    'text!sheetRoute/sheetRoute.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhSheetRoute', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$route', '$scope', function($route, $scope){
                        $scope.sheetId = $route.current.params.sheetId;
                    }]
                };
            });
    }
});