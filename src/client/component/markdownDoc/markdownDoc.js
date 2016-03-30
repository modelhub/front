define('markdownDoc/markdownDoc', [
    'styler',
    'text!markdownDoc/markdownDoc.css',
    'text!markdownDoc/markdownDoc.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhMarkdownDoc', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentVersionId: '@'
                    },
                    controller: ['$element', '$scope', 'api', 'md', function($element, $scope, api, md){
                        $scope.loading = true;
                        var rootEl = $element[0].getElementsByClassName('root')[0];
                        api.v1.documentVersion.getSeedFile($scope.documentVersionId, null, 'plain/text').then(function(mdDoc){
                            $scope.loading = false;
                            rootEl.innerHTML = md(mdDoc);
                        }, function(errorId){
                            $scope.errorId = errorId;
                            $scope.loading = false;
                        });
                    }]
                };
            });
    }
});