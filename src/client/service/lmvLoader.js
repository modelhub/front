define('service/lmvLoader', [
], function(
){
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';
    style.type = 'text/css';
    document.head.appendChild(style);

    var script = document.createElement('script');
    script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';
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