define('service/currentUser', [
], function(
){
    return function(ngModule){
        ngModule
            .service('currentUser', ['$http', function($http){
                var userInfo;
                return {
                    getInfo: function(success, error){
                        if(userInfo){
                            success(userInfo);
                        }else {
                            $http
                                .get('/openid/userInfo')
                                .success(function (resp) {
                                    userInfo = resp;
                                    success({
                                        avatar: resp.avatar,
                                        fullName: resp.fullName
                                    });
                                })
                                .error(error);
                        }
                    }
                };
            }]);
    }
});
