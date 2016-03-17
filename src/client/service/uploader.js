define('service/uploader', [
], function(
){
    return function(ngModule){
        ngModule
            .service('uploader', ['$rootScope', 'api', 'thumbnail', 'EVENT', function($rootScope, api, thumbnail, EVENT){
                var entries = [],
                    addToEntries = function(obj){
                        entries.push({uploadId: obj.uploadId, name: name, parentId: parentId, newType: newType, status: 'uploading'});
                    },
                    uploadHelper = function(newType, parentId, name, thumbnailData){
                        if(newType === 'document'){
                            api.v1.treeNode.createDocument(parentId, name, '', file, thumbnailData.type, thumbnailData.blob).then(addToEntries);
                        } else {
                            api.v1.documentVersion.create(parentId, '', file, thumbnailData.type, thumbnailData.blob).then(addToEntries);
                        }
                    };

                $rootScope.$on(EVENT.UPLOAD_PROGRESS, function(event, data){
                    
                });

                return {
                    start: function(newType, parentId, name, file){
                        if(file) {
                            if (file.type.match(/(image.*|video.*)/)) {
                                thumbnail(file, 196).then(function (data) {
                                    uploadHelper(newType, parentId, name, data);
                                }, function (error) {
                                    uploadHelper(newType, parentId, name, {type: null, blob: null});
                                });
                            } else {
                                uploadHelper(newType, parentId, name, {type: null, blob: null});
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
