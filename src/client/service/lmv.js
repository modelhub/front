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
                                    viewer = new lmvLoader.Autodesk.Viewing.Private.GuiViewer3D(el, {});
                                } else {
                                    viewer = new lmvLoader.Autodesk.Viewing.Viewer3D(el, {});
                                }
                                Autodesk.Viewing.Initializer(null, function(){
                                    viewer.initialize();
                                    resolve({
                                        addEventListener: function(type, fn){
                                            return viewer.addEventListener(type, fn);
                                        },
                                        removeEventListener: function(type, fn){
                                            return viewer.removeEventListener(type, fn);
                                        },
                                        loadSheet: function(sheet) {
                                            return viewer.load('/api/v1/sheet/getItem/' + sheet.id + sheet.manifest);
                                        },
                                        unloadSheet: function(sheet){
                                            viewer.impl.unloadModel(sheet.model);
                                        },
                                        setLightPreset: function(idx){
                                            return viewer.setLightPreset(idx);
                                        },
                                        fitToView: function(instant, boundingBox){
                                            viewer.navigation.fitBounds(instant, boundingBox);
                                        },
                                        sceneUpdated: function() {
                                            viewer.impl.sceneUpdated(true);
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