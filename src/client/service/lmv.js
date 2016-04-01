define('service/lmv', [
], function(
){
    var INIT_TIMEOUT = 5000;

    return function(ngModule){
        ngModule
            .service('lmv', ['$q', '$rootScope', 'lmvLoader', function($q, $rootScope, lmvLoader){
                return function(el){
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
                                viewer = new Autodesk.Viewing.Private.GuiViewer3D(el, {});
                                Autodesk.Viewing.Initializer(null, function(){
                                    viewer.initialize();
                                    resolve({
                                        loadSheet: function(sheet) {
                                            viewer.load('/api/v1/sheet/getItem/' + sheet.id + sheet.manifest);
                                        },
                                        unloadSheet: function(id){
                                            //TODO
                                        },
                                        resize: function(){
                                            viewer.resize();
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