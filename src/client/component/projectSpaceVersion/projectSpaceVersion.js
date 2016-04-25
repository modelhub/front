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
                    controller: ['$scope', '$window', 'api', 'EVENT', 'sheetExtender', function($scope, $window, api, EVENT, sheetExtender){
                        var viewer,
                            projectSpaceVersion,
                            sheetTransforms = [],
                            highlightedClash = null,
                            loadedSheets;

                        $scope.loadedSheets = loadedSheets = [null, null];
                        $scope.loadingModel = [false, false];
                        $scope.selections = [null, null];

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                $scope.viewer = viewer = data.viewer;

                                viewer.createOverlayScene('mh-green', 'green');
                                viewer.createOverlayScene('mh-red', 'red');

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
                                                $scope.loadingModel[i] = false;
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
                                                $scope.loadingModel[i] = false;
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

                        var overridenFragIds = {};
                        function clearAnyExistingColorOverrides(){
                            for (var prop in overridenFragIds) {
                                if(overridenFragIds.hasOwnProperty(prop)) {
                                    var mesh = overridenFragIds[prop];
                                    if (mesh) {
                                        viewer.removeMeshFromOverlayScene('mh-green', mesh);
                                        viewer.removeMeshFromOverlayScene('mh-red', mesh);
                                    }
                                }
                            }
                            overridenFragIds = {};
                        }
                        function isolate(sheetIdx, objId){
                            loadedSheets[sheetIdx].model.visibilityManager.isolate(objId);
                        }
                        function overrideColor(sheetIdx, objId, overlaySceneName){
                            var instanceTree = loadedSheets[sheetIdx].model.getData().instanceTree;
                            var frags = [];

                            instanceTree.enumNodeFragments(objId, function(fragId) {
                                frags.push(fragId);
                            });

                            for (var j=0; j<frags.length; j++) {
                                var mesh = viewer.getRenderProxy(loadedSheets[sheetIdx].model, frags[j]);
                                var proxy = new THREE.Mesh(mesh.geometry, mesh.material); //TODO get rid of global THREE dependency
                                proxy.matrix.copy(mesh.matrixWorld);
                                proxy.matrixAutoUpdate = false;
                                proxy.matrixWorldNeedsUpdate = true;
                                proxy.frustumCulled = false;
                                viewer.addMeshToOverlayScene(overlaySceneName, proxy);
                                overridenFragIds[frags[j]] = proxy;
                            }
                        }

                        $scope.clashClick = function(clash){
                            // remove existing overriden color on frags
                            clearAnyExistingColorOverrides();

                            if(clash === highlightedClash){
                                highlightedClash = null;
                                isolate(0);
                                isolate(1);
                            } else {
                                highlightedClash = clash;
                                //isolate
                                isolate(currentLeftSheetIdx, clash.left);
                                isolate(currentRightSheetIdx, clash.right);
                                //fitToView
                                var bb = loadedSheets[currentLeftSheetIdx].getBoundingBox([clash.left]);
                                bb.union(loadedSheets[currentRightSheetIdx].getBoundingBox([clash.right]));
                                viewer.fitToView(true, bb);
                                //color overrides
                                overrideColor(currentLeftSheetIdx, clash.left, 'mh-green');
                                overrideColor(currentRightSheetIdx, clash.right, 'mh-red');
                            }
                        };

                        $scope.sheetSelectionChange = function(){
                            clearAnyExistingColorOverrides();
                            for(var i = 0; i < 2; i++){
                                if ($scope.selections[i] !== loadedSheets[i]) {
                                    if(loadedSheets[i]) {
                                        $scope.viewer.unloadSheet(loadedSheets[i]);
                                        $scope.loadingModel[i] = false;
                                        loadedSheets[i] = null;
                                    }
                                    if ($scope.selections[i]) {
                                        loadedSheets[i] = $scope.selections[i];
                                        $scope.loadingModel[i] = true;
                                        $scope.viewer.loadSheet({id: loadedSheets[i].sheet, manifest: loadedSheets[i].manifest});
                                    }
                                } else if (loadedSheets[i]) {
                                    isolate(i);
                                }
                            }
                            getClashTest();
                        };

                        var getClashTest,
                            getClashTestDataTimeout,
                            currentLeftSheetIdx,
                            currentRightSheetIdx;
                        getClashTest = function(){
                            currentLeftSheetIdx = currentRightSheetIdx = $scope.clashes = null;
                            $window.clearTimeout(getClashTestDataTimeout);
                            $scope.loadingClashTestData = true;
                            if($scope.selections[0] && $scope.selections[1]){
                                api.v1.clashTest.getForSheetTransforms($scope.selections[0].id, $scope.selections[1].id).then(function(clashTest){
                                    if(clashTest.data.status === "success"){
                                        $scope.clashes = clashTest.data.result;
                                        if(clashTest.data.left.id === loadedSheets[0].clashChangeRegId){
                                            currentLeftSheetIdx = 0;
                                            currentRightSheetIdx = 1;
                                        }else{
                                            currentLeftSheetIdx = 1;
                                            currentRightSheetIdx = 0;
                                        }
                                        $scope.loadingClashTestData = false;
                                    }else{
                                        getClashTestDataTimeout = $window.setTimeout(getClashTest, 10000);
                                    }
                                }, function(errorId){
                                    $scope.clashError = errorId
                                });
                            }
                        }
                    }]
                };
            });
    }
});