define('loader/loader', [
    'styler',
    'text!loader/loader.css',
    'text!loader/loader.html',
    'text!loader/loader.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    return function(ngModule){
        ngModule
            .directive('mhLoader', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$scope', 'i18n', function($scope, i18n){
                        i18n($scope, txt);
                    }]
                };
            });
    }
});