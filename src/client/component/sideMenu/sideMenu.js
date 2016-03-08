define('sideMenu/sideMenu', [
    'styler',
    'text!sideMenu/sideMenu.css',
    'text!sideMenu/sideMenu.html',
    'text!sideMenu/sideMenu.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);
    var searchEl;

    return function(ngModule){
        ngModule
            .directive('mhSideMenu', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$element', '$rootScope', '$scope', 'currentUser', 'EVENT', 'i18n', 'nav', function($element, $rootScope, $scope, currentUser, EVENT, i18n, nav){

                        i18n($scope, txt);


                    }]
                };
            });
    }
});