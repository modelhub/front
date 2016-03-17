define('service/uploader', [
], function(
){
    return function(ngModule){
        ngModule
            .service('uploader', ['thumbnail', function(thumbnail){
                var entries = [];
                return {
                    start: function(file){

                    },
                    getUploads: function(){

                    },
                    clearCompletedAndFailed: function(){

                    }
                };
            }]);
    }
});
