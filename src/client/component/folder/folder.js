define('folder/folder', [
    'styler',
    'text!folder/folder.css',
    'text!folder/folder.html',
    'text!folder/folder.txt.json'
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
            .directive('mhFolder', function(){
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