define('service/upload', [
], function(
){
    return function(ngModule){
        ngModule
            .service('upload', ['thumbnail', function(thumbnail){
                var entries = [];
                return {
                    upload: function(file){

                    },
                    getUploads: function(){

                    },
                    clearCompletedAndFailed: function(){

                    }
                };
            }]);
    }
});
