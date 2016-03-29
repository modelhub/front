define('service/md', [
    'marked'
], function(
    marked
){
    return function(ngModule){
        ngModule
            .service('md', [function(){
                return marked
            }]);
    }
});
