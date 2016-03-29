define('documentVersion/documentVersion', [
    'styler',
    'text!documentVersion/documentVersion.css',
    'text!documentVersion/documentVersion.html',
    'text!documentVersion/documentVersion.txt.json'
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
            .directive('mhDocumentVersion', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentVersionId: '@'
                    },
                    controller: ['$element', '$location', '$rootScope', '$scope', '$window', 'api', 'currentUser', 'EVENT', 'i18n', function($element, $location, $rootScope, $scope, $window, api, currentUser, EVENT, i18n){
                        i18n($scope, txt);

                        $scope.my = currentUser();

                        $scope.loading = true;

                        function errorHandler(errorId){
                            $scope.loadingError = errorId;
                        }

                        api.v1.documentVersion.get([$scope.documentVersionId]).then(function(documentVersions){
                            $scope.documentVersion = documentVersions[0];
                            api.v1.treeNode.get([documentVersions[0].document]).then(function(nodes){
                                $scope.document = nodes[0];
                                $scope.loading = false;
                            }, errorHandler);
                        }, errorHandler);


                    }]
                };
            });
    }
});