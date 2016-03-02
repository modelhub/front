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
                                    return $q(function (resolve, reject) {
                                        $http.post('/api/v1/user/setProperty', {property: property, value: value})
                                            .then(function (resp) {
                                                resolve();
                                            }, reject);
                                    });
                                },

                                getDescription: function (id) {
                                    return $q(function (resolve, reject) {
                                        $http.post('/api/v1/user/getDescription', {id: id})
                                            .then(function (resp) {
                                                resolve(resp.data);
                                            }, reject);
                                    });
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
                                    return $q(function (resolve, reject) {
                                        $http.post('/api/v1/user/search', {search: search, offset: offset, limit: limit, sortBy: sortBy})
                                            .then(function (resp) {
                                                resolve(resp.data);
                                            }, reject);
                                    });
                                }
                            },

                            project: {},

                            treeNode: {},

                            documentVersion: {},

                            sheet: {}
                        }
                    };

                api.v1.user.getCurrent(); //just cache this value on page load, it will always be used.
                return api;
            }]);
    }
});
