define('projectSpace/projectSpace', [
    'ng',
    'styler',
    'text!projectSpace/projectSpace.css',
    'text!projectSpace/projectSpace.html'
], function(
    ng,
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpace', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        projectId: '@'
                    },
                    controller: ['$rootScope', '$scope', 'api', 'EVENT', function($rootScope, $scope, api, EVENT){
                        var sheets = {},
                            viewer = null,
                            projectId = $scope.projectId,
                            broadcastReadyEvent = function(){
                                if($scope.project && viewer) {
                                    $rootScope.$broadcast(EVENT.PROJECT_SPACE_CREATED, ng.copy($scope.project));
                                }
                            };

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                viewer = data.viewer;
                                viewer.addEventListener('svfLoaded', function(event){
                                    var sheetId = event.svf.basePath.split('/')[5];
                                    if(!sheetId){
                                        throw 'couldnt find sheetId from svf basePath property';
                                    }
                                    sheets[sheetId].svf = event.svf;
                                    sheets[sheetId].model = event.model;
                                });
                                viewer.addEventListener('geometryLoaded', function(event){
                                    for(var sheetId in sheets){
                                        if(sheets.hasOwnProperty(sheetId) && sheets[sheetId].model === event.model){
                                            sheets[sheetId].geometryLoaded = true;
                                            return;
                                        }
                                    }
                                });
                                viewer.addEventListener('propertyDbLoaded', function(event){
                                    for(var sheetId in sheets){
                                        if(sheets.hasOwnProperty(sheetId) && sheets[sheetId].model === event.model){
                                            sheets[sheetId].propertyDbLoaded = true;
                                            return;
                                        }
                                    }
                                });
                                $scope.$on(EVENT.LOAD_SHEET_IN_PROJECT_SPACE, function(event, sheet){
                                    if(sheet.project === projectId && !sheets[sheet.id]){
                                        sheets[sheet.id] = {svf: null, model: null, propertyDbLoaded: false, geometryLoaded: false};
                                        viewer.loadSheet(sheet);
                                    }
                                });
                                broadcastReadyEvent();
                            }
                        });

                        api.v1.project.get([projectId]).then(function(projects){
                            $scope.project = projects[0];
                            broadcastReadyEvent();
                        });
                    }]
                };
            });
    }
});