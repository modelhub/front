define('service/uploader', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('uploader', ['$rootScope', '$window', 'api', 'thumbnail', 'EVENT', function($rootScope, $window, api, thumbnail, EVENT){
                var idx = {},
                    entries = [],
                    addToEntries = function(newType, parentId, name, fileName, fileType, thumbnailData){
                        var fileExtension = "";
                        var lastIdx = fileName.lastIndexOf(".");
                        if (lastIdx !== -1) {
                            fileExtension = fileName.substring(lastIdx);
                        }
                        return function(obj){
                            entries.push({uploadId: obj.uploadId, progress: 0, name: name, fileExtension: fileExtension, fileType: fileType, parentId: parentId, newType: newType, status: 'uploading', image: thumbnailData.image});
                            idx[obj.uploadId] = entries.length - 1;
                            $rootScope.$broadcast(EVENT.UPLOAD_START, entries[entries.length - 1]);
                            $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                        };
                    },
                    uploadHelper = function(newType, parentId, name, file, thumbnailData){
                        if(newType === 'document'){
                            api.v1.treeNode.createDocument(parentId, name, '', file, thumbnailData.type, thumbnailData.blob).then(addToEntries(newType, parentId, name, file.name, file.type, thumbnailData));
                        } else {
                            api.v1.documentVersion.create(parentId, '', file, thumbnailData.type, thumbnailData.blob).then(addToEntries(newType, parentId, name, file.name, file.type, thumbnailData));
                        }
                    };

                $rootScope.$on(EVENT.UPLOAD_PROGRESS, function(event, data){
                    var done = data.event.loaded || data.event.position,
                        total = data.event.total || data.event.totalSize;
                    entries[idx[data.uploadId]].progress = $window.Math.round((done / total) * 100);
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_SUCCESS, function(event, data){
                    entries[idx[data.uploadId]].progress = 100;
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_ERROR, function(event, data){
                    entries[idx[data.uploadId]].status = 'error';
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_REQUEST_SUCCESS, function(event, data){
                    entries[idx[data.uploadId]].status = 'success';
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_REQUEST_ERROR, function(event, data){
                    entries[idx[data.uploadId]].status = 'error';
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                return {
                    start: function(newType, parentId, name, file){
                        if(file) {
                            if (file.type.match(/(image.*|video.*)/)) {
                                thumbnail(file, 196).then(function (thumbnailData) {
                                    uploadHelper(newType, parentId, name, file, thumbnailData);
                                }, function (error) {
                                    uploadHelper(newType, parentId, name, file, {image: null, type: null, blob: null});
                                });
                            } else {
                                uploadHelper(newType, parentId, name, file, {image: null, type: null, blob: null});
                            }
                        }
                    },
                    getUploads: function(){
                        var res = [];
                        for(var i = 0, l = entries.length; i < l; i++) {
                            res.push(ng.copy(entries[i]));
                        }
                        return res;
                    },
                    clearFinished: function(){
                        idx = {};
                        for(var i = 0; i < entries.length; i++) {
                            if(entries[i].status === 'error' || entries[i].status === 'success'){
                                entries.splice(i, 1);
                                i--;
                            } else {
                                idx[entries[i].uploadId] = i;
                            }
                        }
                        $rootScope.$broadcast(EVENT.UPLOADS_CLEARED, {remaining: entries.length});
                        $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                    }
                };
            }]);
    }
});
