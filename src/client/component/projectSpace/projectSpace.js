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
                    controller: ['$rootScope', '$scope', 'api', 'EVENT', function($rootScope, $scope, api, EVENT){
                        var viewer;

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                viewer = data.viewer;
                                $rootScope.$broadcast(EVENT.PROJECT_SPACE_CREATED, $scope.projectId);
                            }
                        });
                    }]
                };
            });
    }
});