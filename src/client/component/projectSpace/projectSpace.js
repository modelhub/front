define('projectSpace/projectSpace', [
    'styler',
    'text!projectSpace/projectSpace.css',
    'text!projectSpace/projectSpace.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpace', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        projectId: '@'
                    },
                    controller: ['$scope', 'api', 'EVENT', function($scope, api, EVENT){
                        var viewer,
                            sheet,
                            loadSheet = function(){
                                if(viewer && sheet){
                                    viewer.loadSheet(sheet);
                                }
                            };

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                viewer = data.viewer;
                                loadSheet();
                            }
                        });
                        api.v1.sheet.get([$scope.sheetId]).then(function(sheets){
                            sheet = sheets[0];
                            loadSheet();
                        }, function(errorId){
                            $scope.loadingError = errorId;
                        });
                    }]
                };
            });
    }
});