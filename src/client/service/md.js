define('service/md', [
    'markdown'
], function(
    markdown
){
    return function(ngModule){
        ngModule
            .service('md', [function(){
                return function(){
                    return markdown.toHTML.apply(markdown, arguments);
                }
            }]);
    }
});
