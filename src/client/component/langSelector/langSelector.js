define('langSelector/langSelector', [
    'styler',
    'text!langSelector/langSelector.langs.json',
    'text!langSelector/langSelector.css',
    'text!langSelector/langSelector.html'
], function(
    styler,
    langs,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhLangSelector', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$scope', 'api', function($scope, api){
                        $scope.langs = JSON.parse(langs);
                        $scope.change = function(){
                            if($scope.selected && $scope.selected.code){

                            }
                        };
                    }]
                };
            });
    }
});