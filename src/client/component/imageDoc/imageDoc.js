define('imageDoc/imageDoc', [
    'styler',
    'text!imageDoc/imageDoc.css',
    'text!imageDoc/imageDoc.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhImageDoc', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentVersionFileType: '@',
                        documentVersionId: '@'
                    },
                    controller: ['$element', '$scope', function($element, $scope){
                        $scope.loading = true;
                        var imgEl = $element[0].getElementsByTagName('img')[0];
                        imgEl.addEventListener('load', function(){
                            $scope.loading = false;
                        });
                    }]
                };
            });
    }
});