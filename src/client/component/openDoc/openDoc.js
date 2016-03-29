define('openDoc/openDoc', [
    'styler',
    'text!openDoc/openDoc.css',
    'text!openDoc/openDoc.html',
    'text!openDoc/openDoc.txt.json'
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
                    controller: ['$scope', 'i18n', function($scope, i18n){
                        i18n($scope, txt);
                        $scope.docUrl = '/resource/viewerJs/#/api/v1/documentVersion/getSeedFile/'+$scope.documentVersionId+'/'+$scope.documentName+".v"+$scope.documentVersionVersion+"."+$scope.documentVersionFileExtension;
                    }]
                };
            });
    }
});