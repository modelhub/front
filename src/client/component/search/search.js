define('search/search', [
    'styler',
    'text!search/search.css',
    'text!search/search.html',
    'text!search/search.txt.json'
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
            .directive('mhSearch', function(){
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