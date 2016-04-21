define('service/api', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('api', ['$document', '$http', '$q', '$rootScope', '$window', 'csrfToken', 'currentUser', 'EVENT', function($document, $http, $q, $rootScope, $window, csrfToken, currentUser, EVENT){
                var currentUserV1 = currentUser(),
                    userCacheV1 = {},
                    pendingUserIdToPromiseIdMapV1 = {},
                    pendingUserPromisesV1 = {},
                    promiseIdSrc = 0,
                    uploadIdSrc = 0,
                    newPromiseId = function(){return ''+promiseIdSrc++;},
                    doJsonReq = function(path, data){
                        return $q(function (resolve, reject) {
                            $http.post(path, data, {headers:{'Csrf-Token': csrfToken()}})
                                .then(function (resp) {
                                    resolve(resp.data);
                                }, function(resp){
                                    reject(resp.data);
                                });
                        });
                    },
                    doFormReq = function(path, data){
                        return $q(function (resolve, reject) {
                            $http.post(path, data, {
                                headers: {
                                    'Csrf-Token': csrfToken(),
                                    'Content-Type': undefined
                                },
                                transformRequest: angular.identity
                            }).then(function (resp) {
                                    resolve(resp.data);
                            }, function(resp){
                                reject(resp.data);
                            });
                        });
                    },
                    doUploadProgressReq = function(path, data){
                        var uploadId = uploadIdSrc++;
                        return $q(function(resolve, reject){
                            var xhr = new $window.XMLHttpRequest();
                            xhr.open("POST", path, true);
                            xhr.setRequestHeader('Csrf-Token', csrfToken());
                            xhr.upload.addEventListener('progress', function(e){
                                $rootScope.$broadcast(EVENT.UPLOAD_PROGRESS, {uploadId: uploadId, event: e});
                            });
                            xhr.upload.addEventListener('load', function(e){
                                $rootScope.$broadcast(EVENT.UPLOAD_SUCCESS, {uploadId: uploadId, event: e});
                            });
                            xhr.upload.addEventListener('error', function(e){
                                $rootScope.$broadcast(EVENT.UPLOAD_ERROR, {uploadId: uploadId, event: e});
                            });
                            xhr.onreadystatechange = function(e){
                                if(xhr.readyState === 4 && xhr.status === 200){
                                    $rootScope.$broadcast(EVENT.UPLOAD_REQUEST_SUCCESS, {uploadId: uploadId});
                                } else if (xhr.readyState === 4 && xhr.status !== 200){
                                    $rootScope.$broadcast(EVENT.UPLOAD_REQUEST_ERROR, {uploadId: uploadId, errorId: xhr.responseText});
                                }
                            };
                            xhr.send(data);
                            resolve({uploadId: uploadId});
                        });
                    },
                    api = {

                        v1: {

                            user: {

                                getCurrent: function () {
                                    var pendingCurrentUserKey = 'currentUser';
                                    if (!pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey]) {
                                        var promiseId = newPromiseId();
                                        pendingUserPromisesV1[promiseId] = $q(function (resolve, reject) {
                                            if (currentUserV1) {
                                                resolve(ng.copy(currentUserV1));
                                            } else {
                                                $http.post('/api/v1/user/getCurrent', null, {headers:{'Csrf-Token': csrfToken()}})
                                                    .then(function (resp) {
                                                        currentUserV1 = ng.copy(resp.data);
                                                        userCacheV1[currentUserV1.id] = ng.copy(resp.data);
                                                        delete pendingUserPromisesV1[promiseId];
                                                        delete pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey];
                                                        resolve(ng.copy(resp.data));
                                                    }, function(resp){
                                                        reject(resp.data);
                                                    });
                                            }
                                        });
                                        pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey] = promiseId;
                                    }
                                    return pendingUserPromisesV1[pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey]];
                                },

                                setProperty: function (property, value) {
                                    return doJsonReq('/api/v1/user/setProperty', {property: property, value: value});
                                },

                                get: function (ids) {
                                    var unCachedAndNonePendingIds = [];
                                    var newPendingUsers = [];
                                    var masterPromiseList = [];
                                    var addedToMasterPromiseIds = {};
                                    for (var i = 0, l = ids.length; i < l; i++) {
                                        var id = ids[i];
                                        var promiseId = pendingUserIdToPromiseIdMapV1[id];
                                        if (promiseId && !addedToMasterPromiseIds[promiseId]) {
                                            masterPromiseList.push(pendingUserPromisesV1[promiseId]);
                                            addedToMasterPromiseIds[promiseId] = true;
                                        } else if (!userCacheV1[id]) {
                                            unCachedAndNonePendingIds.push(id);
                                            newPendingUsers.push(id);
                                        }
                                    }
                                    if (unCachedAndNonePendingIds.length > 0) {
                                        var currentPromiseId = newPromiseId();
                                        pendingUserPromisesV1[currentPromiseId] = $q(function (resolve, reject) {
                                            $http.post('/api/v1/user/get', {ids: unCachedAndNonePendingIds}, {headers:{'Csrf-Token': csrfToken()}})
                                                .then(function (resp) {
                                                    if (resp && resp.data && resp.data.length > 0) {
                                                        for (var i = 0, l = resp.data.length; i < l; i++) {
                                                            userCacheV1[resp.data[i].id] = ng.copy(resp.data[i]);
                                                            delete pendingUserPromisesV1[currentPromiseId];
                                                            delete pendingUserIdToPromiseIdMapV1[resp.data[i].id];
                                                        }
                                                    }
                                                    resolve();
                                                }, function(resp){
                                                    reject(resp.data);
                                                });
                                            });
                                        for (var i = 0, l = newPendingUsers.length; i < l; i++) {
                                            pendingUserIdToPromiseIdMapV1[newPendingUsers[i]] = currentPromiseId;
                                        }
                                        masterPromiseList.push(pendingUserPromisesV1[currentPromiseId]);
                                    }
                                    return $q.all(masterPromiseList).then(function(){
                                        var results = [];
                                        for (var i = 0, l = ids.length; i < l; i++) {
                                            results.push(ng.copy(userCacheV1[ids[i]]));
                                        }
                                        return results;
                                    }, function(err){
                                        throw err;
                                    });
                                },

                                search: function (search, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/user/search', {search: search, offset: offset, limit: limit, sortBy: sortBy});
                                }
                            },

                            project: {

                                create: function (name, thumbnailType, thumbnail) {
                                    name = name || "";
                                    var data = new FormData();
                                    data.append('name', name);
                                    if(thumbnail && thumbnailType) {
                                        data.append('thumbnail', thumbnail, 'a.a');
                                        data.append('thumbnailType', thumbnailType);
                                    }
                                    return doFormReq('/api/v1/project/create', data);
                                },

                                setName: function (id, name) {
                                    return doJsonReq('/api/v1/project/setName', {id: id, name: name});
                                },

                                setThumbnail: function (id, thumbnailType, thumbnail) {
                                    var data = new FormData();
                                    data.append('id', id);
                                    if(thumbnail && thumbnailType) {
                                        data.append('thumbnail', thumbnail, '');
                                        data.append('thumbnailType', thumbnailType);
                                    }
                                    return doFormReq('/api/v1/project/setThumbnail', data);
                                },

                                addUsers: function (id, role, users) {
                                    return doJsonReq('/api/v1/project/addUsers', {id: id, role: role, users: users});
                                },

                                removeUsers: function (id, users) {
                                    return doJsonReq('/api/v1/project/removeUsers', {id: id, users: users});
                                },

                                acceptInvite: function (id) {
                                    return doJsonReq('/api/v1/project/acceptInvite', {id: id});
                                },

                                declineInvite: function (id) {
                                    return doJsonReq('/api/v1/project/declineInvite', {id: id});
                                },

                                getRole: function (id) {
                                    return doJsonReq('/api/v1/project/getRole', {id: id});
                                },

                                getMemberships: function (id, role, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/project/getMemberships', {id: id, role: role, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                getMembershipInvites: function (id, role, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/project/getMembershipInvites', {id: id, role: role, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                get: function (ids) {
                                    return doJsonReq('/api/v1/project/get', {ids: ids});
                                },

                                getInUserContext: function (user, role, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/project/getInUserContext', {user: user, role: role, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                getInUserInviteContext: function (user, role, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/project/getInUserInviteContext', {user: user, role: role, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                search: function (search, role, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/project/search', {search: search, role: role, offset: offset, limit: limit, sortBy: sortBy});
                                }
                            },

                            treeNode: {

                                createFolder: function (parent, name) {
                                    return doJsonReq('/api/v1/treeNode/createFolder', {parent: parent, name: name});
                                },

                                createDocument: function (parent, name, uploadComment, file, thumbnailType, thumbnail) {
                                    name = name || "";
                                    uploadComment = uploadComment || "";
                                    var data = new FormData();
                                    data.append('parent', parent);
                                    data.append('name', name);
                                    data.append('uploadComment', uploadComment);
                                    data.append('file', file);
                                    data.append('fileType', file.type);
                                    if(thumbnail && thumbnailType) {
                                        data.append('thumbnail', thumbnail, 'a.a');
                                        data.append('thumbnailType', thumbnailType);
                                    }
                                    return doUploadProgressReq('/api/v1/treeNode/createDocument', data);
                                },

                                createProjectSpace: function (parent, name, createComment, sheetTransforms, camera, thumbnailType, thumbnail) {
                                    name = name || "";
                                    createComment = createComment || "";
                                    var data = new FormData();
                                    data.append('parent', parent);
                                    data.append('name', name);
                                    data.append('createComment', createComment);
                                    data.append('sheetTransforms', JSON.stringify(sheetTransforms));
                                    data.append('camera', JSON.stringify(camera));
                                    if(thumbnail && thumbnailType) {
                                        data.append('thumbnail', thumbnail, 'a.a');
                                        data.append('thumbnailType', thumbnailType);
                                    }
                                    return doFormReq('/api/v1/treeNode/createProjectSpace', data);
                                },

                                setName: function (id, name) {
                                    return doJsonReq('/api/v1/treeNode/setName', {id: id, name: name});
                                },

                                move: function (parent, ids) {
                                    return doJsonReq('/api/v1/treeNode/move', {parent: parent, ids: ids});
                                },

                                get: function (ids) {
                                    return doJsonReq('/api/v1/treeNode/get', {ids: ids});
                                },

                                getChildren: function (id, nodeType, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/treeNode/getChildren', {id: id, nodeType: nodeType, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                getParents: function (id) {
                                    return doJsonReq('/api/v1/treeNode/getParents', {id: id});
                                },

                                globalSearch: function (search, nodeType, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/treeNode/globalSearch', {search: search, nodeType: nodeType, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                projectSearch: function (project, search, nodeType, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/treeNode/projectSearch', {project: project, search: search, nodeType: nodeType, offset: offset, limit: limit, sortBy: sortBy});
                                }
                                
                            },

                            documentVersion: {

                                create: function (document, uploadComment, file, thumbnailType, thumbnail) {
                                    name = name || "";
                                    uploadComment = uploadComment || "";
                                    var data = new FormData();
                                    data.append('document', document);
                                    data.append('uploadComment', uploadComment);
                                    data.append('file', file);
                                    data.append('fileType', file.type);
                                    if(thumbnail && thumbnailType) {
                                        data.append('thumbnail', thumbnail, 'a.a');
                                        data.append('thumbnailType', thumbnailType);
                                    }
                                    return doUploadProgressReq('/api/v1/documentVersion/create', data);
                                },

                                get: function (ids) {
                                    return doJsonReq('/api/v1/documentVersion/get', {ids: ids});
                                },

                                getForDocument: function (document, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/documentVersion/getForDocument', {document: document, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                getSeedFile: function (id, ext, fileType) {
                                    var path = '/api/v1/documentVersion/getSeedFile/'+id;
                                    if (ext){
                                        path += '.'+ext;
                                    }
                                    if (fileType){
                                        path += '/'+fileType;
                                    }
                                    return $q(function(resolve, reject){
                                        $http.get(path).then(function(resp){
                                            resolve(resp.data)
                                        }, function(resp){
                                            reject(resp.data);
                                        });
                                    });
                                }

                            },

                            projectSpaceVersion: {

                                create: function (projectSpace, createComment, sheetTransforms, camera, thumbnailType, thumbnail) {
                                    name = name || "";
                                    createComment = createComment || "";
                                    var data = new FormData();
                                    data.append('projectSpace', projectSpace);
                                    data.append('createComment', createComment);
                                    data.append('sheetTransforms', JSON.stringify(sheetTransforms));
                                    data.append('camera', JSON.stringify(camera));
                                    if(thumbnail && thumbnailType) {
                                        data.append('thumbnail', thumbnail, 'a.a');
                                        data.append('thumbnailType', thumbnailType);
                                    }
                                    return doFormReq('/api/v1/projectSpaceVersion/create', data);
                                },

                                get: function (ids) {
                                    return doJsonReq('/api/v1/projectSpaceVersion/get', {ids: ids});
                                },

                                getForProjectSpace: function (projectSpace, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/projectSpaceVersion/getForProjectSpace', {projectSpace: projectSpace, offset: offset, limit: limit, sortBy: sortBy});
                                }

                            },

                            sheet: {

                                setName: function (id, name) {
                                    return doJsonReq('/api/v1/sheet/setName', {id: id, name: name});
                                },

                                get: function (ids) {
                                    return doJsonReq('/api/v1/sheet/get', {ids: ids});
                                },

                                getForDocumentVersion: function (documentVersion, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/sheet/getForDocumentVersion', {documentVersion: documentVersion, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                globalSearch: function (search, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/sheet/globalSearch', {search: search, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                projectSearch: function (project, search, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/sheet/globalSearch', {project: project, search: search, offset: offset, limit: limit, sortBy: sortBy});
                                }

                            },

                            sheetTransform: {

                                get: function (ids) {
                                    return doJsonReq('/api/v1/sheetTransform/get', {ids: ids});
                                },

                                getForProjectSpaceVersion: function (projectSpaceVersion, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/sheetTransform/getForProjectSpaceVersion', {projectSpaceVersion: projectSpaceVersion, offset: offset, limit: limit, sortBy: sortBy});
                                }

                            },

                            helper: {

                                getChildrenDocumentsWithLatestVersionAndFirstSheetInfo: function (folder, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/helper/getChildrenDocumentsWithLatestVersionAndFirstSheetInfo', {folder: folder, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                getDocumentVersionsWithFirstSheetInfo: function (document, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/helper/getDocumentVersionsWithFirstSheetInfo', {document: document, offset: offset, limit: limit, sortBy: sortBy});
                                },

                                getChildrenProjectSpacesWithLatestVersion: function (folder, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/helper/getChildrenProjectSpacesWithLatestVersion', {folder: folder, offset: offset, limit: limit, sortBy: sortBy});
                                }

                            }
                        }
                    };

                userCacheV1[currentUserV1.id] = ng.copy(currentUserV1);
                return api;
            }]);
    }
});
