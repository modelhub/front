define('service/modelhub', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('modelhub', ['$http', function($http){
                var currentUser,
                    userCache = {},
                    modelhub = {
                        user: {
                            getCurrent: function(success, error){
                                if(currentUser){
                                    success(currentUser);
                                }else{
                                    $http.post('/api/v1/user/getCurrent')
                                        .then(function (resp) {
                                            currentUser = ng.clone(resp.data);
                                            userCache[currentUser.id] = ng.clone(resp.data);
                                            success(currentUser);
                                        }, error);
                                }
                            },
                            setProperty: function(property, value, success, error){
                                $http.post('/api/v1/user/setProperty', {property: property, value: value}).then(function(resp){success(resp.data);}, error)
                            },
                            get: function(ids, success, error){
                                if(ids && ids.length === 1 && userCache[ids[0]] && userCache[ids[0]].description) {
                                    success(ng.clone(userCache[ids[0]]));
                                }else{
                                    unCachedIds = [];
                                    for(var i = 0, l = ids.length; i < l; i++){
                                        if(!userCache[ids[i]]){
                                            unCachedIds.push(ids[i])
                                        }
                                    }
                                    $http.post('/api/v1/user/get', {ids: unCachedIds})
                                        .then(function(resp){
                                            success(resp.data);
                                        }, error)
                                }
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
