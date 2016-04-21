define('projectSpaceVersion/projectSpaceVersion', [
    'styler',
    'text!projectSpaceVersion/projectSpaceVersion.css',
    'text!projectSpaceVersion/projectSpaceVersion.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhProjectSpaceVersion', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        projectSpaceVersionId: '@'
                    },
                    controller: ['$scope', 'api', 'EVENT', function($scope, api, EVENT){
                        var viewer,
                            projectSpaceVersion;

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                viewer = data.viewer;
                            }
                        });

                        api.v1.projectSpaceVersion.get([$scope.projectSpaceVersionId]).then(function(projectSpaceVersions){
                            projectSpaceVersion = projectSpaceVersions[0];
                            api.v1.sheetTransform.getForProjectSpaceVersion($scope.projectSpaceVersionId, 0, 100, 'nameAsc').then(function(sheetTransforms){
                                $scope.sheetTransforms = sheetTransforms;
                            }, function(errorId){
                                $scope.loadingError = errorId;
                            });
                        }, function(errorId){
                            $scope.loadingError = errorId;
                        });
                    }]
                };
            });
    }
});