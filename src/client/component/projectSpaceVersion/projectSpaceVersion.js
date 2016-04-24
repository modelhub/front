define('projectSpaceVersion/projectSpaceVersion', [
    'styler',
    'text!projectSpaceVersion/projectSpaceVersion.css',
    'text!projectSpaceVersion/projectSpaceVersion.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpaceVersion', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        projectSpaceVersionId: '@'
                    },
                    controller: ['$scope', 'api', 'EVENT', 'sheetExtender', function($scope, api, EVENT, sheetExtender){
                        var viewer,
                            projectSpaceVersion,
                            sheetTransforms = [],
                            loadedSheets = [null, null];

                        $scope.selections = [null, null];

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                $scope.viewer = viewer = data.viewer;
                                viewer.addEventListener('svfLoaded', function(event){
                                    var sheetId = event.svf.basePath.split('/')[5];
                                    if(!sheetId){
                                        throw 'couldnt find sheetId from svf basePath property';
                                    }
                                    for(var i = 0, l = loadedSheets.length; i < l; i++){
                                        if(loadedSheets[i].sheet === sheetId){
                                            loadedSheets[i].svf = event.svf;
                                            loadedSheets[i].model = event.model;
                                            return;
                                        }
                                    }
                                });
                                viewer.addEventListener('geometryLoaded', function(event){
                                    for(var i = 0, l = loadedSheets.length; i < l; i++){
                                        if(loadedSheets[i].model === event.model){
                                            loadedSheets[i].geometryLoaded = true;
                                            if(loadedSheets[i].geometryLoaded && loadedSheets[i].propertyDbLoaded){
                                                $scope.$evalAsync();
                                            }
                                            return;
                                        }
                                    }
                                });
                                viewer.addEventListener('propertyDbLoaded', function(event){
                                    for(var i = 0, l = loadedSheets.length; i < l; i++){
                                        if(loadedSheets[i].model === event.model){
                                            loadedSheets[i].propertyDbLoaded = true;
                                            if(loadedSheets[i].geometryLoaded && loadedSheets[i].propertyDbLoaded){
                                                $scope.$evalAsync();
                                            }
                                            return;
                                        }
                                    }
                                });
                            }
                        });

                        var loadNextBatch,
                            loadingSheetTransforms = true;
                        loadNextBatch = function() {
                            loadingSheetTransforms = true;
                            api.v1.sheetTransform.getForProjectSpaceVersion($scope.projectSpaceVersionId, sheetTransforms.length, 100, 'nameAsc').then(function (result) {
                                for(var i = 0; i < result.results.length; i++){
                                    sheetExtender(result.results[i]);
                                    sheetTransforms.push(result.results[i])
                                }
                                if(sheetTransforms.length < result.totalResults){
                                    loadNextBatch();
                                } else {
                                    loadingSheetTransforms = false;
                                }
                            }, function (errorId) {
                                loadingSheetTransforms = false;
                                $scope.loadingError = errorId;
                            });
                        };

                        api.v1.projectSpaceVersion.get([$scope.projectSpaceVersionId]).then(function (projectSpaceVersions) {
                            projectSpaceVersion = projectSpaceVersions[0];
                            loadNextBatch();
                        }, function (errorId) {
                            loadingSheetTransforms = false;
                            $scope.loadingError = errorId;
                        });

                        $scope.sheetTransformList = function(idx){
                            var list = [];
                            var altIdx = 0;
                            if (altIdx === idx){
                                altIdx = 1;
                            }
                            for(var i = 0; i < sheetTransforms.length; i++){
                                if(sheetTransforms[i] !== $scope.selections[altIdx]){
                                    list.push(sheetTransforms[i]);
                                }
                            }
                            return list;
                        };

                        $scope.sheetSelectionChange = function(){
                            for(var i = 0; i < 2; i++){
                                if ($scope.selections[i] !== loadedSheets[i]) {
                                    if(loadedSheets[i]) {
                                        $scope.viewer.unloadSheet(loadedSheets[i]);
                                        loadedSheets[i] = null;
                                    }
                                    if ($scope.selections[i]) {
                                        loadedSheets[i] = $scope.selections[i];
                                        $scope.viewer.loadSheet({id: loadedSheets[i].sheet, manifest: loadedSheets[i].manifest});
                                    }
                                }
                            }
                            if($scope.selections[0] && $scope.selections[1]){
                                //TODO GET SOME CLASH RESULTS!! Ha-a-a-llelujah! Ha-a-a-llelujah! Hallelujah! Hallelujah! Ha-a-lle-e-luja-a-h!
                                api.v1.clashTest.getForSheetTransforms($scope.selections[0].id, $scope.selections[1].id).then(function(result){
                                    console.log(result);
                                }, function(errorId){
                                    //TODO
                                    $scope.clashError = errorId
                                });
                            }
                        };
                    }]
                };
            });
    }
});