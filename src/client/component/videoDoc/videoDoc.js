define('videoDoc/videoDoc', [
    'styler',
    'text!videoDoc/videoDoc.css',
    'text!videoDoc/videoDoc.html',
    'text!videoDoc/videoDoc.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    return function(ngModule){
        ngModule
            .directive('mhVideoDoc', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentVersionFileType: '@',
                        documentVersionId: '@'
                    },
                    controller: ['$scope', 'i18n', function($scope, i18n){
                        i18n($scope, txt);
                        $scope.videoUrl = '/api/v1/documentVersion/getSeedFile/'+$scope.documentVersionId;
                    }]
                };
            });
    }
});