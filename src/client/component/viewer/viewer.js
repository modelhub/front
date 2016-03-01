define('viewer/viewer', [
    'styler',
    'text!viewer/viewer.css',
    'text!viewer/viewer.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    var viewerIDSrc = 0,
        INIT_TIMEOUT = 5000;

    return function(ngModule){
        ngModule
            .directive('mhViewer', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$scope', '$rootScope', 'lmvLoader', function($scope, $rootScope, lmvLoader){
                        $scope.viewerID = 'viewer-' + viewerIDSrc++;
                        var firstInitAttemptTime = Date.now(),
                            init;
                        init = function(){

                            if(!lmvLoader.isReady()){
                                if(Date.now() - firstInitAttemptTime <= INIT_TIMEOUT) {
                                    setTimeout(init, 500);
                                }else{
                                    $rootScope.$broadcast('viewer_init_timeout');
                                }
                            }else{
                                //ready to init now
                                var viewerEl = document.getElementById($scope.viewerID);
                                var viewer = new Autodesk.Viewing.Viewer3D(viewerEl, {});
                                Autodesk.Viewing.Initializer(null, function(){viewer.initialize();});

                                /**
                                 * START CUSTOM HIGHLIGHT FUNC
                                 */
                                var overridenFragIds = {};
                                var highlight = function(coreObjDbid, spokeDbids){
                                    var allDbids = spokeDbids.slice();
                                    allDbids.push(coreObjDbid);
                                    // remove overriden color on frags
                                    for (var p in overridenFragIds) {
                                        var mesh = overridenFragIds[p];
                                        if (mesh) {
                                            viewer.impl.removeOverlay('redHighlightOverlay', mesh);
                                            viewer.impl.removeOverlay('greenHighlightOverlay', mesh);
                                        }
                                    }
                                    overridenFragIds = {};
                                    if(spokeDbids == null || spokeDbids.length == 0){
                                        this.isolate();
                                    }else{
                                        this.fitToView(allDbids);
                                        this.isolate(allDbids);
                                        //set clash colors
                                        if(!spokeDbids || spokeDbids.length == 0) {
                                            return;
                                        }
                                        viewer.getObjectTree(function(objTree) {
                                            var len = allDbids.length;
                                            for(var i = 0; i < len; i++){
                                                var frags = [];
                                                var overlay = 'greenHighlightOverlay';
                                                objTree.enumNodeFragments(allDbids[i], function(fragId) {
                                                    frags.push(fragId);
                                                });
                                                if(i === len - 1){
                                                    overlay = 'redHighlightOverlay';
                                                }
                                                //override color on frags
                                                for (var j=0; j<frags.length; j++) {
                                                    var mesh = viewer.impl.getRenderProxy(viewer.impl.model, frags[j]);
                                                    var myProxy = new THREE.Mesh(mesh.geometry, mesh.material);
                                                    myProxy.matrix.copy(mesh.matrixWorld);
                                                    myProxy.matrixAutoUpdate = false;
                                                    myProxy.matrixWorldNeedsUpdate = true;
                                                    myProxy.frustumCulled = false;
                                                    viewer.impl.addOverlay(overlay, myProxy);
                                                    overridenFragIds[frags[j]] = myProxy;  // keep track of the frags so that we can remove later
                                                }
                                            }
                                        });
                                    }
                                };
                                /**
                                 * END CUSTOM HIGHLIGHT FUNC
                                 */

                                /**
                                 * START EVENT LISTENERS
                                 */

                                $scope.$on('load_sheet', function(e, sheetFetchData) {
                                    viewer.finish();
                                    viewer = new Autodesk.Viewing.Viewer3D(viewerEl, {});
                                    Autodesk.Viewing.Initializer(null, function(){
                                        viewer.initialize();

                                        viewer.highlight = highlight;
                                        viewer.impl.createOverlayScene('redHighlightOverlay', new THREE.MeshBasicMaterial({ color: 'red' }));
                                        viewer.impl.createOverlayScene('greenHighlightOverlay', new THREE.MeshBasicMaterial({ color: 'green' }));

                                        viewer.load('/api/v1/getSheetItem/' + sheetFetchData.urn);
                                    });
                                });


                                $scope.$on('unload_sheet', function(e, sheetInfo){
                                    //TODO figure out how to unload models based on urn
                                });

                                /**
                                 * END EVENT LISTENERS
                                 */
                            }
                        };
                        setTimeout(init, 0);
                    }]
                };
            });
    }
});