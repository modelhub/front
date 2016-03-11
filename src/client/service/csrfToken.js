define('service/csrfToken', [
], function(
){
    return function(ngModule){
        ngModule
            .service('csrfToken', ['$document', function($document){
                var csrfEl = $document[0].getElementById('mh-csrf-token'),
                    csrfToken = csrfEl.dataset.csrfToken;

                csrfEl.parentNode.removeChild(csrfEl);

                return function(){
                    return csrfToken;
                };
            }]);
    }
});
