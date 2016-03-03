define('header/header', [
    'styler',
    'text!header/header.css',
    'text!header/header.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhHeader', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$scope', function($scope){

                    }]
                };
            });
    }
});