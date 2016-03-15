define('logout/logout', [
    'styler',
    'text!logout/logout.css',
    'text!logout/logout.html',
    'text!logout/logout.txt.json'
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
            .directive('mhLogout', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$scope', 'i18n', 'logout', function($scope, i18n, logout){
                        i18n($scope, txt);
                        logout();
                    }]
                };
            });
    }
});