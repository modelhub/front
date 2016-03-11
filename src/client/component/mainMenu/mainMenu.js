define('mainMenu/mainMenu', [
    'styler',
    'text!mainMenu/mainMenu.css',
    'text!mainMenu/mainMenu.html',
    'text!mainMenu/mainMenu.txt.json'
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
            .directive('mhMainMenu', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$rootScope', '$scope', 'currentUser', 'EVENT', 'i18n', 'logout', function($rootScope, $scope, currentUser, EVENT, i18n, logout){

                        i18n($scope, txt);

                        $scope.my = currentUser();

                        $scope.hideMainMenuBtnClick = function(){
                            $rootScope.$broadcast(EVENT.HIDE_MAIN_MENU);
                        };

                    }]
                };
            });
    }
});