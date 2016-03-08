define('service/logout', [
], function(
){
    return function(ngModule){
        ngModule
            .service('logout', ['$document', '$window', function($document, $window){
                var openIdProviderHost = window.mhOpenIdProviderHost;
                delete window.mhOpenIdProviderHost;
                return function(){
                    var iframe = document.createElement('iframe');
                    iframe.src = openIdProviderHost + '/Authentication/LogOut';
                    iframe.style.display = 'none';
                    iframe.addEventListener('load', function(){
                        $window.location.assign('/openid/login');
                    }, true);
                    $document[0].body.appendChild(iframe);
                };
            }]);
    }
});
