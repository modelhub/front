define('service/uploader', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('uploader', ['$rootScope', '$window', 'api', 'thumbnail', 'EVENT', function($rootScope, $window, api, thumbnail, EVENT){
                var maxActive = 2,
                    finished = [],
                    active = [],
                    queued = [],
                    startCallback = function(entry){
                        return function(obj){
                            entry.uploadId = obj.uploadId;
                            $rootScope.$broadcast(EVENT.UPLOADS_COUNT_CHANGE, {count: finished.length + active.length + queued.length});
                            $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                        }
                    },
                    getActiveIdx = function(uploadId){
                        for(var i = 0; i < active.length; i++){
                            if(active[i].uploadId === uploadId){
                                return i;
                            }
                        }
                    },
                    startUpload = function(entry){
                        entry.status = 'uploading';
                        active.push(entry);
                        if (entry.newType === 'document') {
                            api.v1.treeNode.createDocument(entry.parentId, entry.name, '', entry.file, entry.thumbnailData.type, entry.thumbnailData.blob).then(startCallback(entry));
                        } else {
                            api.v1.documentVersion.create(entry.parentId, '', entry.file, entry.thumbnailData.type, entry.thumbnailData.blob).then(startCallback(entry));
                        }
                    },
                    uploadHelper = function(newType, parentId, name, file, thumbnailData){
                        var fileExtension = "",
                            lastIdx = file.name.lastIndexOf(".");
                        if (lastIdx !== -1) {
                            fileExtension = file.name.substring(lastIdx+1);
                        }
                        var entry = {uploadId: -1, progress: 0, name: name, fileExtension: fileExtension, file: file, parentId: parentId, newType: newType, status: 'queued', thumbnailData: thumbnailData};
                        if(active.length >= maxActive){
                            queued.push(entry);
                        } else {
                            startUpload(entry);
                        }
                    };

                $rootScope.$on(EVENT.UPLOAD_PROGRESS, function(event, data){
                    var done = data.event.loaded || data.event.position,
                        total = data.event.total || data.event.totalSize;
                    active[getActiveIdx(data.uploadId)].progress = $window.Math.round((done / total) * 100);
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_SUCCESS, function(event, data){
                    active[getActiveIdx(data.uploadId)].progress = 100;
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_ERROR, function(event, data){
                    var entry = active.splice(getActiveIdx(data.uploadId), 1)[0];
                    entry.status = 'error';
                    finished.push(entry);
                    entry = queued.splice(0, 1)[0];
                    if(entry){
                        startUpload(entry);
                    }
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_REQUEST_SUCCESS, function(event, data){
                    var entry = active.splice(getActiveIdx(data.uploadId), 1)[0];
                    entry.status = 'success';
                    entry.progress = 100;
                    finished.push(entry);
                    entry = queued.splice(0, 1)[0];
                    if(entry){
                        startUpload(entry);
                    }
                    $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                });

                $rootScope.$on(EVENT.UPLOAD_REQUEST_ERROR, function(event, data){
                    var entry = active.splice(getActiveIdx(data.uploadId), 1)[0];
                    entry.status = 'error';
                    finished.push(entry);
                    entry = queued.splice(0, 1)[0];
                    if(entry){
                        startUpload(entry);
                    }
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
                        for(var i = 0, l = finished.length; i < l; i++) {
                            res.push(ng.copy(finished[i]));
                        }
                        for(var i = 0, l = active.length; i < l; i++) {
                            res.push(ng.copy(active[i]));
                        }
                        for(var i = 0, l = queued.length; i < l; i++) {
                            res.push(ng.copy(queued[i]));
                        }
                        return res;
                    },
                    clearFinished: function(){
                        finished = [];
                        $rootScope.$broadcast(EVENT.UPLOADS_COUNT_CHANGE, {count: finished.length + active.length + queued.length});
                        $rootScope.$broadcast(EVENT.UPLOADS_CHANGED);
                    }
                };
            }]);
    }
});
