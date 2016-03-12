define('invites/invites', [
    'styler',
    'text!invites/invites.css',
    'text!invites/invites.html',
    'text!invites/invites.txt.json'
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
            .directive('mhInvites', function(){
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