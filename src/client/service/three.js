define('service/three', [
], function(
){
    var INIT_TIMEOUT = 5000;

    return function(ngModule){
        ngModule
            .service('three', ['$q', 'lmvLoader', function($q, lmvLoader){
                var three,
                    firstInitAttemptTime = Date.now(),
                    init;

                init = function(resolve, reject) {
                    if(three){
                        resolve(three);
                    } else {
                        if (typeof THREE === 'undefined') {
                            if (Date.now() - firstInitAttemptTime <= INIT_TIMEOUT) {
                                setTimeout(function(){init(resolve, reject);}, 500);
                            } else {
                                reject('loading THREE timed out');
                            }
                        } else {
                            three = THREE;
                            resolve(three);
                        }
                    }
                };
                return function() {
                    return $q(init);
                }
            }]);
    };
});