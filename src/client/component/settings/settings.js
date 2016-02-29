define('settings/settings', [
    'styler',
    'text!settings/settings.css',
    'text!settings/settings.html',
    'text!settings/settings.txt.json'
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
            .directive('cpSettings', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller:['$scope', 'i18n', function($scope, i18n){
                        i18n($scope, txt);
                    }]
                };
            });
    }
});