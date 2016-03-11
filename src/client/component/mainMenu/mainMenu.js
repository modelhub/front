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
                    controller: ['$element', '$location', '$rootScope', '$route', '$scope', 'currentUser', 'EVENT', 'i18n', 'logout', function($element, $location, $rootScope, $route, $scope, currentUser, EVENT, i18n, logout){

                        i18n($scope, txt);

                        $scope.my = currentUser();

                        $element[0].getElementsByTagName('input')[0].addEventListener('keypress', function(e){
                            if(e.keyCode == 13) { //enter
                                var search = $scope.search.trim();
                                if (search.length > 0) {
                                    $scope.search = '';
                                    $location.path('/search/'+search);
                                    $scope.$evalAsync();
                                }
                            }
                        });

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
                            $scope.selected = $location.path().split('/')[1];
                            if ($scope.selected === 'logout') {
                                logout();
                            }
                        });

                        $scope.projectsBtnClick();
                    }]
                };
            });
    }
});