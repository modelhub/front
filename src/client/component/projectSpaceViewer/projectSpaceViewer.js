define('projectSpaceViewer/projectSpaceViewer', [
    'ng',
    'styler',
    'text!projectSpaceViewer/projectSpaceViewer.css',
    'text!projectSpaceViewer/projectSpaceViewer.html',
    'text!projectSpaceViewer/projectSpaceViewer.txt.json'
], function(
    ng,
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpaceViewer', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        projectId: '@'
                    },
                    controller: ['$rootScope', '$scope', '$window', 'api', 'EVENT', 'i18n', 'sheetExtender', function($rootScope, $scope, $window, api, EVENT, i18n, sheetExtender){
                        i18n($scope, txt);
                        var loadedSheets = {},
                            viewer = null,
                            projectId = $scope.projectId,
                            broadcastReadyEvent = function(){
                                if($scope.project && viewer) {
                                    $rootScope.$broadcast(EVENT.PROJECT_SPACE_CREATED, ng.copy($scope.project));
                                }
                            };

                        var sheets = $scope.sheets = [];
                        $scope.showSheetsMenu = true;
                        $scope.toggleSheetsMenuBtnClick = function(){
                            if(viewer) {
                                $scope.showSheetsMenu = !$scope.showSheetsMenu;
                                $window.setTimeout(viewer.resize, 0);
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
                                    for(var i = 0, l = sheets.length; i < l; i++){
                                        if(sheets[i].id === sheetId){
                                            sheets[i].svf = event.svf;
                                            sheets[i].model = event.model;
                                            return;
                                        }
                                    }
                                });
                                viewer.addEventListener('geometryLoaded', function(event){
                                    for(var i = 0, l = sheets.length; i < l; i++){
                                        if(sheets[i].model === event.model){
                                            sheets[i].geometryLoaded = true;
                                            if(sheets[i].geometryLoaded && sheets[i].propertyDbLoaded){
                                                $scope.$evalAsync();
                                            }
                                            return;
                                        }
                                    }
                                });
                                viewer.addEventListener('propertyDbLoaded', function(event){
                                    for(var i = 0, l = sheets.length; i < l; i++){
                                        if(sheets[i].model === event.model){
                                            sheets[i].propertyDbLoaded = true;
                                            if(sheets[i].geometryLoaded && sheets[i].propertyDbLoaded){
                                                $scope.$evalAsync();
                                            }
                                            return;
                                        }
                                    }
                                });
                                $scope.$on(EVENT.LOAD_SHEET_IN_PROJECT_SPACE, function(event, sheet){
                                    if(sheet.project === projectId && !loadedSheets[sheet.id]){
                                        var sheetCopy = ng.copy(sheet);
                                        loadedSheets[sheet.id] = sheetCopy;
                                        sheetCopy.svf = sheetCopy.model = null;
                                        sheetCopy.geometryLoaded = sheetCopy.propertyDbLoaded = false;
                                        sheetExtender(sheetCopy);
                                        sheets.push(sheetCopy);
                                        viewer.loadSheet(sheet);
                                    }
                                });
                                broadcastReadyEvent();
                            }
                        });

                        $scope.$on(EVENT.GET_PROJECT_SPACE, function(event, data){
                            if(data.projectId === projectId){
                                var sheetTransforms = [];
                                for(var sheetId in loadedSheets){
                                    if(loadedSheets.hasOwnProperty(sheetId)){
                                        sheetTransforms.push({
                                            sheet: sheetId,
                                            transform: {
                                                scale: {
                                                    x: loadedSheets[sheetId].transform.scale.x,
                                                    y: loadedSheets[sheetId].transform.scale.y,
                                                    z: loadedSheets[sheetId].transform.scale.z
                                                },
                                                rotate: {
                                                    w: loadedSheets[sheetId].transform.rotate.w,
                                                    x: loadedSheets[sheetId].transform.rotate.x,
                                                    y: loadedSheets[sheetId].transform.rotate.y,
                                                    z: loadedSheets[sheetId].transform.rotate.z
                                                },
                                                translate: {
                                                    x: loadedSheets[sheetId].transform.translate.x,
                                                    y: loadedSheets[sheetId].transform.translate.y,
                                                    z: loadedSheets[sheetId].transform.translate.z
                                                }
                                            }
                                        });
                                    }
                                }
                                //will probably need to add more info here, world units etc.
                                data.callback({sheetTransforms: sheetTransforms, camera: {/*TODO*/}});
                            }
                        });

                        $scope.$on(EVENT.GET_PROJECT_SPACE_THUMBNAIL, function(event, data){
                            if(data.projectId === projectId){
                                viewer.getScreenShot(data.size, data.size, data.callback);
                            }
                        });

                        api.v1.project.get([projectId]).then(function(projects){
                            $scope.project = projects[0];
                            broadcastReadyEvent();
                        });

                        $scope.fitToView = function(sheet){
                            if(sheet.propertyDbLoaded && sheet.geometryLoaded) {
                                viewer.fitToView(false, sheet.getBoundingBox());
                            }
                        };

                        $scope.applyTransforms = function(sheet){
                            if(sheet.propertyDbLoaded && sheet.geometryLoaded) {
                                sheet.applyTransforms();
                                viewer.sceneUpdated();
                            }
                        };

                        $scope.removeSheet = function(sheet){
                            if(sheet.propertyDbLoaded && sheet.geometryLoaded) {
                                viewer.unloadSheet(sheet);
                                delete loadedSheets[sheet.id];
                                for(var i = 0, l = sheets.length; i < l; i++){
                                    if(sheets[i] == sheet){
                                        sheets.splice(i, 1);
                                        if(sheets.length === 0){
                                            viewer.sceneUpdated();
                                        }
                                        return;
                                    }
                                }
                            }
                        };
                    }]
                };
            });
    }
});