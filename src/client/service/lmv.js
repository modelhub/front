define('service/lmv', [
], function(
){
    var INIT_TIMEOUT = 5000;

    return function(ngModule){
        ngModule
            .service('lmv', ['$q', '$rootScope', 'lmvLoader', function($q, $rootScope, lmvLoader){
                return function(el, type){
                    return $q(function(resolve, reject){
                        var viewer,
                            firstInitAttemptTime = Date.now(),
                            init;

                        init = function(){
                            if(!lmvLoader.isReady()){
                                if(Date.now() - firstInitAttemptTime <= INIT_TIMEOUT) {
                                    setTimeout(init, 500);
                                }else{
                                    reject();
                                }
                            }else{
                                //ready to init now
                                if(type === 'gui') {
                                    viewer = new Autodesk.Viewing.Private.GuiViewer3D(el, {});
                                } else {
                                    viewer = new Autodesk.Viewing.Viewer3D(el, {});
                                }
                                Autodesk.Viewing.Initializer(null, function(){
                                    viewer.initialize();
                                    resolve({
                                        addEventListener: function(type, fn){
                                            return viewer.addEventListener(type, fn);
                                        },
                                        removeEventListener: function(event, fn){
                                            return viewer.removeEventListener(event, fn);
                                        },
                                        loadSheet: function(sheet) {
                                            return viewer.load('/api/v1/sheet/getItem/' + sheet.id + sheet.manifest);
                                        },
                                        unloadSheet: function(id){
                                            //TODO
                                        },
                                        colorSheet: function(sheetId, sheetModel, color){
                                            viewer.impl.createOverlayScene(sheetId, new THREE.MeshBasicMaterial({ color: color }));

                                            sheetModel.getObjectTree(function(objTree) {
                                                var frags = [];
                                                objTree.enumNodeFragments(sheetModel.getData().instanceTree.getRootId(), function(fragId) {
                                                    frags.push(fragId);
                                                }, true);
                                                //override color on frags
                                                for (var i=0; i < frags.length; i++) {
                                                    var mesh = viewer.impl.getRenderProxy(viewer.impl.model, frags[i]);
                                                    var myProxy = new THREE.Mesh(mesh.geometry, mesh.material);
                                                    myProxy.matrix.copy(mesh.matrixWorld);
                                                    myProxy.matrixAutoUpdate = false;
                                                    myProxy.matrixWorldNeedsUpdate = true;
                                                    myProxy.frustumCulled = false;
                                                    viewer.impl.addOverlay(sheetId, myProxy);
                                                }
                                            });
                                        },
                                        setLightPreset: function(idx){
                                            return viewer.setLightPreset(idx);
                                        },
                                        resize: function(){
                                            return viewer.resize();
                                        },
                                        finish: function(){
                                            return viewer.finish();
                                        }
                                    });
                                });
                            }

                        };
                        setTimeout(init, 100);
                    });
                };
            }]);
    }
});