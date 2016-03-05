define('document/document', [
    'styler',
    'text!document/document.css',
    'text!document/document.html',
    'text!document/document.txt.json'
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
            .directive('mhDocument', function(){
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