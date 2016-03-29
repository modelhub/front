define('audioDoc/audioDoc', [
    'styler',
    'text!audioDoc/audioDoc.css',
    'text!audioDoc/audioDoc.html',
    'text!audioDoc/audioDoc.txt.json'
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
            .directive('mhAudioDoc', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentVersionFileType: '@',
                        documentVersionId: '@'
                    },
                    controller: ['$scope', 'i18n', function($scope, i18n){
                        i18n($scope, txt);
                        $scope.audioUrl = '/api/v1/documentVersion/getSeedFile/'+$scope.documentVersionId;
                    }]
                };
            });
    }
});