define('openDoc/openDoc', [
    'styler',
    'text!openDoc/openDoc.css',
    'text!openDoc/openDoc.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhOpenDoc', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentName: '@',
                        documentVersionVersion: '@',
                        documentVersionFileExtension: '@',
                        documentVersionId: '@'
                    },
                    controller: ['$scope', function($scope){
                        $scope.docUrl = '/resource/viewerJs/#/api/v1/documentVersion/getSeedFile/'+$scope.documentVersionId+'/'+$scope.documentName+".v"+$scope.documentVersionVersion+"."+$scope.documentVersionFileExtension;
                    }]
                };
            });
    }
});