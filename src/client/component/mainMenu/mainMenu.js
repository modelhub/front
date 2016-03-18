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
                    controller: ['$location', '$rootScope', '$route', '$scope', 'currentUser', 'EVENT', 'i18n', function($location, $rootScope, $route, $scope, currentUser, EVENT, i18n){

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

                        $scope.searchInputKeyPress = function(e){
                            if(e.keyCode == 13) { //enter
                                $scope.search = $scope.search.trim();
                                if ($scope.search.length > 0) {
                                    $location.path('/search/global/'+$scope.search);
                                    $scope.$evalAsync();
                                }
                            }
                        };

                        $scope.aggregationBtnClick = function(){
                            $location.path('/aggregation');
                        };

                        $scope.$on('$locationChangeSuccess', function(){
                            $scope.search = '';
                            $scope.selected = $location.path().split('/')[1];
                        });

                        $scope.uploadCount = 0;
                        $scope.$on(EVENT.UPLOAD_START, function(){
                            $scope.uploadCount++
                        });

                        $scope.$on(EVENT.UPLOADS_CLEARED, function(event, data){
                            $scope.uploadCount = data.remaining;
                        });
                    }]
                };
            });
    }
});