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
                    controller: ['$location', '$rootScope', '$scope', 'EVENT', function($location, $rootScope, $scope, EVENT) {

                        $scope.showMainMenu = true;

                        $scope.showMainMenuBtnClick = function(){
                            $scope.showMainMenu = true;
                            $rootScope.$broadcast(EVENT.SHOW_MAIN_MENU);
                        };

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $scope.showMainMenu = false;
                        });

                        $scope.$on('$locationChangeSuccess', function(){
                            var pathParts = $location.path().split('/');
                            if(pathParts[1] === 'projectSpace'){
                                $scope.showProjectSpace = pathParts[2];
                            } else {
                                $scope.showProjectSpace = '';
                            }
                        });

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

                        $scope.$on(EVENT.PROJECT_SPACE_CREATED, function(event, projectId){
                            $scope.projectSpaces[projectId].ready = true;
                            for(var sheetId in $scope.projectSpaces[projectId].queuedSheets){
                                if($scope.projectSpaces[projectId].queuedSheets.hasOwnProperty(sheetId)){
                                    $rootScope.$broadcast(EVENT.LOAD_SHEET_IN_PROJECT_SPACE, $scope.projectSpaces[projectId].queuedSheets[sheetId]);
                                }
                            }
                            delete $scope.projectSpaces[projectId].queuedSheets;
                        });

                        $scope.$on(EVENT.DESTROY_PROJECT_SPACE, function(event, projectId){
                            delete $scope.projectSpaces[projectId];
                        });

                    }]
                };
            });
    }
});