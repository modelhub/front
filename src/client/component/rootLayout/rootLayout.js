define('rootLayout/rootLayout', [
    'styler',
    'text!rootLayout/rootLayout.css',
    'text!rootLayout/rootLayout.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhRootLayout', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$location', '$rootScope', '$scope', '$window', 'EVENT', function($location, $rootScope, $scope, $window, EVENT) {

                        $scope.showMainMenu = true;

                        $scope.showMainMenuBtnClick = function(){
                            $scope.showMainMenu = true;
                            $rootScope.$broadcast(EVENT.SHOW_MAIN_MENU);
                        };

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $scope.showMainMenu = false;
                        });

                        var handleLocationChange = function(){
                            var pathParts = $location.path().split('/');
                            if(pathParts[1] === 'projectSpace'){
                                var projectId = pathParts[2];
                                if($scope.projectSpaces[projectId]){
                                    $scope.showProjectSpace = projectId;
                                    return;
                                }
                                $window.history.back()
                            }
                            $scope.showProjectSpace = '';
                        };
                        $scope.$on('$locationChangeSuccess', handleLocationChange);

                        $scope.projectSpaces = {};
                        $scope.$on(EVENT.LOAD_SHEET_IN_PROJECT_SPACE, function(event, sheet){
                            var undefined;
                            if($scope.projectSpaces[sheet.project] === undefined){ //first time a sheet from this project has requested to be loaded into the projectSpace
                                var entry = {ready: false, queuedSheets: {}};
                                entry.queuedSheets[sheet.id] = sheet;
                                $scope.projectSpaces[sheet.project] = entry;
                            } else if ($scope.projectSpaces[sheet.project].ready === false && $scope.projectSpaces[sheet.project].queuedSheets[sheet.id] === undefined) { //the projectSpace is currently under construction and this sheet isnt in the load queue
                                $scope.projectSpaces[sheet.project].queuedSheets[sheet.id] = sheet;
                            } else if ($scope.projectSpaces[sheet.project].ready === true) {
                                //dont do anything the project space will have caught this event and will be loading the sheet itself
                            } else {
                                throw 'unexpected projectSpace state';
                            }
                        });

                        $scope.$on(EVENT.PROJECT_SPACE_CREATED, function(event, project){
                            $window.setTimeout(function(){
                                $scope.projectSpaces[project.id].ready = true;
                                for(var sheetId in $scope.projectSpaces[project.id].queuedSheets){
                                    if($scope.projectSpaces[project.id].queuedSheets.hasOwnProperty(sheetId)){
                                        $rootScope.$broadcast(EVENT.LOAD_SHEET_IN_PROJECT_SPACE, $scope.projectSpaces[project.id].queuedSheets[sheetId]);
                                    }
                                }
                                delete $scope.projectSpaces[project.id].queuedSheets;
                            }, 0);
                        });

                        $scope.$on(EVENT.DESTROY_PROJECT_SPACE, function(event, projectId){
                            delete $scope.projectSpaces[projectId];
                            handleLocationChange();
                        });

                    }]
                };
            });
    }
});