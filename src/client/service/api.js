define('service/api', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('api', ['$http', '$q', function($http, $q){
                var currentUserV1,
                    userCacheV1 = {},
                    pendingUserIdToPromiseIdMapV1 = {},
                    pendingUserPromisesV1 = {},
                    promiseIdSrc = 0,
                    newPromiseId = function(){return ''+promiseIdSrc++;},
                    doJsonReq = function(path, data){
                        return $q(function (resolve, reject) {
                            $http.post(path, data)
                                .then(function (resp) {
                                    resolve(resp.data);
                                }, reject);
                        });
                    },
                    doNullReq = function(path, data){
                        return $q(function (resolve, reject) {
                            $http.post(path, data)
                                .then(function () {
                                    resolve();
                                }, reject);
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
                                                $http.post('/api/v1/user/getCurrent')
                                                    .then(function (resp) {
                                                        currentUserV1 = ng.copy(resp.data);
                                                        userCacheV1[currentUserV1.id] = ng.copy(resp.data);
                                                        delete pendingUserPromisesV1[promiseId];
                                                        delete pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey];
                                                        resolve(ng.copy(resp.data));
                                                    }, reject);
                                            }
                                        });
                                        pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey] = promiseId;
                                    }
                                    return pendingUserPromisesV1[pendingUserIdToPromiseIdMapV1[pendingCurrentUserKey]];
                                },

                                setProperty: function (property, value) {
                                    return doNullReq('/api/v1/user/setProperty', {property: property, value: value});
                                },

                                getDescription: function (id) {
                                    return doJsonReq('/api/v1/user/getDescription', {id: id});
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
                                            $http.post('/api/v1/user/get', {ids: unCachedAndNonePendingIds})
                                                .then(function (resp) {
                                                    if (resp && resp.data && resp.data.length > 0) {
                                                        for (var i = 0, l = resp.data.length; i < l; i++) {
                                                            userCacheV1[resp.data[i].id] = ng.copy(resp.data[i]);
                                                            delete pendingUserPromisesV1[currentPromiseId];
                                                            delete pendingUserIdToPromiseIdMapV1[resp.data[i].id];
                                                        }
                                                    }
                                                    resolve();
                                                }, reject);
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
                                        return err;
                                    });
                                },

                                search: function (search, offset, limit, sortBy) {
                                    return doJsonReq('/api/v1/user/search', {search: search, offset: offset, limit: limit, sortBy: sortBy});
                                }
                            },

                            project: {

                                create: function (name, description, image) {
                                    name = name || "";
                                    description = description || "";
                                    return $q(function (resolve, reject) {
                                        var data = new FormData();
                                        data.append('name', name);
                                        data.append('description', description);
                                        if(image) {
                                            data.append('file', image);
                                        }
                                        $http.post('/api/v1/project/create', data, {
                                                headers: {'Content-Type': undefined },
                                                transformRequest: angular.identity
                                            }).then(function(resp){
                                                resolve(resp.data);
                                            }, reject);
                                    });
                                },

                                setName: function (id, name) {
                                    return doNullReq('/api/v1/project/setName', {id: id, name: name});
                                },

                                setDescription: function (id, description) {
                                    return doNullReq('/api/v1/project/setDescription', {id: id, description: description});
                                },

                                setImage: function (id, image) {
                                    return $q(function (resolve, reject) {
                                        var data = new FormData();
                                        data.append('id', id);
                                        if(image) {
                                            data.append('file', image);
                                        }
                                        $http.post('/api/v1/project/setImage', data, {
                                            headers: {'Content-Type': undefined},
                                            transformRequest: angular.identity
                                        }).then(function () {
                                            resolve();
                                        }, reject);
                                    });
                                },

                                addUsers: function (id, role, users) {
                                    return doNullReq('/api/v1/project/addUsers', {id: id, role: role, users: users});
                                },

                                removeUsers: function (id, users) {
                                    return doNullReq('/api/v1/project/removeUsers', {id: id, users: users});
                                },

                                acceptInvite: function (id) {
                                    return doNullReq('/api/v1/project/acceptInvite', {id: id});
                                },

                                declineInvite: function (id) {
                                    return doNullReq('/api/v1/project/declineInvite', {id: id});
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

                                
                            },

                            documentVersion: {},

                            sheet: {}
                        }
                    };

                api.v1.user.getCurrent(); //just cache this value on page load, it will always be used.
                return api;
            }]);
    }
});
