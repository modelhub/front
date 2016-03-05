define('documentVersion/documentVersion', [
    'styler',
    'text!documentVersion/documentVersion.css',
    'text!documentVersion/documentVersion.html',
    'text!documentVersion/documentVersion.txt.json'
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
            .directive('mhDocumentVersion', function(){
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