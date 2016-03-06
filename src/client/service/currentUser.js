define('service/currentUser', [
    'ng'
], function(
    ng
){
    return function(ngModule){
        ngModule
            .service('currentUser', [function(){
                var currentUser = ng.copy(window.mhCurrentUser);
                delete window.mhCurrentUser;
                return function(){
                    return ng.copy(currentUser);
                };
            }]);
    }
});
