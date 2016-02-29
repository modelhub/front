define('service/lmvLoader', [
], function(
){
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://viewing.api.autodesk.com/viewingservice/v1/viewers/style.css?v=1.2.23';
    style.type = 'text/css';
    document.head.appendChild(style);

    // Loading this script adds the global Autodesk object
    var script = document.createElement('script');
    script.src = 'https://viewing.api.autodesk.com/viewingservice/v1/viewers/viewer3D.js?v=1.2.23';
    document.head.appendChild(script);

    return function(ngModule){
        ngModule
            .service('lmvLoader', function(){
                return {
                    isReady: function(){
                        return typeof Autodesk !== 'undefined';
                    }
                };
            });
    };
});