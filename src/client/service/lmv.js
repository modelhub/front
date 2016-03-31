define('service/lmv', [
], function(
){
    var lmvServiceIdSrc = 0,
        INIT_TIMEOUT = 5000;

    return function(ngModule){
        ngModule
            .service('lmv', ['$q', '$rootScope', 'lmvLoader', function($q, $rootScope, lmvLoader){
                return function(el){
                    return $q(function(resolve, reject){
                        var viewer,
                            instanceId = lmvServiceIdSrc++,
                            elId = 'lmv-service-id-' + instanceId,
                            firstInitAttemptTime = Date.now(),
                            init;

                        el.id = elId;

                        init = function(){
                            if(!lmvLoader.isReady()){
                                if(Date.now() - firstInitAttemptTime <= INIT_TIMEOUT) {
                                    setTimeout(init, 500);
                                }else{
                                    reject();
                                }
                            }else{
                                //ready to init now
                                viewer = new Autodesk.Viewing.Private.GuiViewer3D(el, {});
                                Autodesk.Viewing.Initializer(null, function(){
                                    viewer.initialize();
                                    resolve({
                                        instanceId: function(){
                                            return instanceId;
                                        },
                                        containerEl: function(){
                                            return el;
                                        },
                                        loadSheet: function(id, manifestPath) {
                                            viewer.load('/api/v1/sheet/getItem/' + id + manifestPath);
                                        },
                                        resize: function(){
                                            viewer.resize();
                                        },
                                        unloadSheet: function(id){
                                            //TODO
                                        },
                                        finish: function(){
                                            viewer.finish();
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