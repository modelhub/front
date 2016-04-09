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
                                        setLightPreset: function(idx){
                                            return viewer.setLightPreset(idx);
                                        },
                                        fitToView: function(model, objectIds){

                                            var instant = true;

                                            var fit = function(){
                                                var fitTo = null;
                                                if( Array.isArray(objectIds) && (objectIds.length > 0) )
                                                {
                                                    var bounds = new THREE.Box3();
                                                    var box = new THREE.Box3();

                                                    var instanceTree = model.getData().instanceTree;
                                                    var fragList = model.getFragmentList();

                                                    for (var i=0; i<objectIds.length; i++) {
                                                        instanceTree.enumNodeFragments(objectIds[i], function(fragId) {
                                                            fragList.getWorldBounds(fragId, box);
                                                            bounds.union(box);
                                                        }, true);
                                                    }

                                                    if( !bounds.empty() )
                                                        fitTo = bounds;
                                                }
                                                if( !fitTo || fitTo.empty() )
                                                    fitTo = viewer.impl.getFitBounds();

                                                viewer.navigation.fitBounds(false, fitTo);

                                                viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, checkGeomAndFit);
                                                viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, fit);

                                                return instant;
                                            };

                                            var checkGeomAndFit = function () {
                                                if(model && model.isLoadDone()){
                                                    fit();
                                                } else {
                                                    instant = false;
                                                    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, fit);
                                                }
                                            };

                                            var propertyDB = model.getData().propertydb,
                                                propertyDBFileExists = propertyDB && propertyDB.attrs.length > 0;


                                            // This doesn't guarantee that an object tree will be created but it will be pretty likely
                                            if (!model.is2d() && propertyDBFileExists && objectIds !== null && objectIds !== undefined) {

                                                if (model && model.isObjectTreeCreated()) {
                                                    checkGeomAndFit();
                                                } else {
                                                    instant = false;
                                                    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, checkGeomAndFit);
                                                }
                                            } else {
                                                // Fallback, fit to the model bounds
                                                viewer.navigation.fitBounds(false, viewer.impl.getFitBounds(true));
                                            }
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