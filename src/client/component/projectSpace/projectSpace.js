define('projectSpace/projectSpace', [
    'ng',
    'styler',
    'text!projectSpace/projectSpace.css',
    'text!projectSpace/projectSpace.html'
], function(
    ng,
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
                    controller: ['$rootScope', '$scope', 'api', 'EVENT', function($rootScope, $scope, api, EVENT){
                        var viewer,
                            projectId = $scope.projectId,
                            broadcastReadyEvent = function(){
                                if($scope.project && viewer) {
                                    $rootScope.$broadcast(EVENT.PROJECT_SPACE_CREATED, ng.copy($scope.project));
                                }
                            };

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                viewer = data.viewer;
                                $scope.$on(EVENT.LOAD_SHEET_IN_PROJECT_SPACE, function(event, sheet){
                                    if(sheet.project === projectId){
                                        viewer.loadSheet(sheet);
                                    }
                                });
                                broadcastReadyEvent();
                            }
                        });

                        api.v1.project.get([projectId]).then(function(projects){
                            $scope.project = projects[0];
                            broadcastReadyEvent();
                        });
                    }]
                };
            });
    }
});