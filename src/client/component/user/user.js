define('user/user', [
    'styler',
    'text!user/user.css',
    'text!user/user.html',
    'text!user/user.txt.json'
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
            .directive('mhUser', function(){
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