define('imageDoc/imageDoc', [
    'styler',
    'text!imageDoc/imageDoc.css',
    'text!imageDoc/imageDoc.html',
    'text!imageDoc/imageDoc.txt.json'
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
            .directive('mhImageDoc', function(){
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