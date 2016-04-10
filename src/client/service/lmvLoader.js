define('service/lmvLoader', [
], function(
){
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://autodeskviewer.com/viewers/2.5.34/style.css';
    style.type = 'text/css';
    document.head.appendChild(style);

    // Loading this script adds the global Autodesk object
    var script = document.createElement('script');
    script.src = 'https://autodeskviewer.com/viewers/2.5.34/viewer3D.js';
    document.head.appendChild(script);

    return function(ngModule){
        ngModule
            .service('lmvLoader', function(){
                return {
                    isReady: function(){
                        if(typeof Autodesk !== 'undefined') {
                            this.Autodesk = Autodesk;
                            return true;
                        }else {
                            return false;
                        }
                    },
                    Autodesk: null
                };
            });
    };
});