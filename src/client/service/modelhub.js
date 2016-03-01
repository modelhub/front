define('service/modelhub', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('modelhub', ['$http', '$q', function($http, $q){
                var currentUser,
                    userCache = {},
                    modelhub = {

                        user: {

                            getCurrent: function(){
                                return $q(function(resolve, reject){
                                    if(currentUser){
                                        resolve(ng.copy(currentUser));
                                    }else{
                                        $http.post('/api/v1/user/getCurrent')
                                            .then(function (resp) {
                                                currentUser = ng.copy(resp.data);
                                                userCache[currentUser.id] = ng.copy(resp.data);
                                                resolve( ng.copy(resp.data));
                                            }, reject);
                                    }
                                });
                            },

                            setProperty: function(property, value){
                                return $q(function(resolve, reject){
                                    $http.post('/api/v1/user/setProperty', {property: property, value: value})
                                        .then(function(resp){
                                            resolve(resp.data);
                                        }, reject);
                                });
                            },

                            get: function(ids){
                                return $q(function(resolve, reject){
                                    var results = [];
                                    var unCachedIds = [];
                                    for(var i = 0, l = ids.length; i < l; i++){
                                        if(!userCache[ids[i]]){
                                            unCachedIds.push(ids[i])
                                        }
                                    }
                                    if (unCachedIds.length > 0) {
                                        $http.post('/api/v1/user/get', {ids: unCachedIds})
                                            .then(function(resp){
                                                if(resp && resp.data && resp.data.length > 0) {
                                                    for(var i = 0, l = resp.data.length; i < l; i++){
                                                        userCache[resp.data[i].id] = ng.copy(resp.data[i]);
                                                    }
                                                }
                                                for(var i = 0, l = ids.length; i < l; i++){
                                                    results.push(ng.copy(userCache[ids[i]]));
                                                }
                                                reolve(results);
                                            }, reject);
                                    }
                                    for(var i = 0, l = ids.length; i < l; i++){
                                        results.push(ng.copy(userCache[ids[i]]));
                                    }
                                    resolve(results);
                                });
                            }
                        },

                        project: {

                        },

                        treeNode: {

                        },

                        documentVersion: {

                        },

                        sheet: {

                        }
                    };

                modelhub
                return modelhub;
            }]);
    }
});
