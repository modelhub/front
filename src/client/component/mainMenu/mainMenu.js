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
                    controller: ['$location', '$rootScope', '$route', '$scope', 'currentUser', 'EVENT', 'i18n', 'logout', function($location, $rootScope, $route, $scope, currentUser, EVENT, i18n, logout){

                        i18n($scope, txt);

                        $scope.my = currentUser();

                        $scope.hideMainMenuBtnClick = function(){
                            $rootScope.$broadcast(EVENT.HIDE_MAIN_MENU);
                        };

                        $scope.logoutBtnClick = function(){
                            $location.path('/logout');
                        };

                        $scope.settingsBtnClick = function(){
                            $location.path('/settings');
                        };

                        $scope.projectsBtnClick = function(){
                            $location.path('/projects');
                        };

                        $scope.invitesBtnClick = function(){
                            $location.path('/invites');
                        };

                        $scope.uploadsBtnClick = function(){
                            $location.path('/uploads');
                        };

                        $scope.aggregationBtnClick = function(){
                            $location.path('/aggregation');
                        };

                        $scope.$on('$locationChangeSuccess', function(){
                            $scope.selected = $location.path().substring(1);
                        });

                        $scope.projectsBtnClick();
                    }]
                };
            });
    }
});