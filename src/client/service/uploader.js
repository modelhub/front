define('service/uploader', [
], function(
){
    return function(ngModule){
        ngModule
            .service('uploader', ['api', 'thumbnail', function(api, thumbnail){
                var uploadIdSrc = 0,
                    entries = [];

                return {
                    start: function(newType, parentId, name, file){
                        if(file) {
                            if (file.type.match(/(image.*|video.*)/)) {
                                thumbnail(file, 196).then(function (data) {

                                }, function (error) {

                                });
                            } else {
                                if(newType === 'document'){
                                    api.v1.treeNode.createDocument(parentId, name, '', file, null, null);
                                } else {
                                    api.v1.documentVersion.create(parentId, '', file, null, null);
                                }
                            }
                        }
                    },
                    getUploads: function(){

                    },
                    clearCompletedAndFailed: function(){

                    }
                };
            }]);
    }
});
