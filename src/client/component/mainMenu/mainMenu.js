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

                        $scope.projectSpaceBtnClick = function(projectSpace){
                            $location.path('/projectSpaceViewer/'+projectSpace.id);
                        };

                        $scope.$on('$locationChangeSuccess', function(){
                            $scope.search = '';
                            $scope.selected = $location.path().split('/')[1];
                            if($scope.selected === 'projectSpace'){
                                $scope.selectedProjectSpaceId = $location.path().split('/')[2];
                            }else{
                                $scope.selectedProjectSpaceId = '';
                            }
                        });

                        $scope.uploadCount = 0;
                        $scope.$on(EVENT.UPLOADS_COUNT_CHANGE, function(event, data){
                            $scope.uploadCount = data.count;
                        });

                        $scope.projectSpaces = [];
                        $scope.$on(EVENT.PROJECT_SPACE_CREATED, function(event, project){
                            $scope.projectSpaces.push({id: project.id, name: project.name});
                        });

                        $scope.closeProjectSpaceBtnClick = function(projectSpace){
                            $rootScope.$broadcast(EVENT.DESTROY_PROJECT_SPACE, projectSpace.id);
                            $scope.projectSpaces.splice($scope.projectSpaces.indexOf(projectSpace), 1);
                        };
                    }]
                };
            });
    }
});