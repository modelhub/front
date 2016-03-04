define('rootLayout/rootLayout', [
    'styler',
    'text!rootLayout/rootLayout.css',
    'text!rootLayout/rootLayout.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhRootLayout', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$location', '$scope', '$window', 'EVENT', function($location, $scope, $window, EVENT) {

                        var knownBaseRoutes = ['user', 'project', 'folder', 'document', 'documentVersion', 'globalSearch'],
                            pathSegments = $location.path().split('/'),
                            base = pathSegments[1],
                            baseArg = pathSegments[2];

                        if (knownBaseRoutes.indexOf(base) === -1 || !baseArg || baseArg === "") {
                            $window.location.assign('#/user/me');
                            base = 'user';
                            baseArg = 'me';
                        }

                        $scope.base = base;
                        $scope.baseArg = baseArg;

                        $scope.showViewer = false;
                        $scope.showUploads = false;

                        $scope.$on(EVENT.SHOW_VIEWER, function(){
                            $scope.showViewer = true;
                        });

                        $scope.$on(EVENT.HIDE_VIEWER, function(){
                            $scope.showViewer = false;
                        });

                        $scope.$on(EVENT.SHOW_UPLOADS, function(){
                            $scope.showUploads = true;
                        });

                        $scope.$on(EVENT.HIDE_UPLOADS, function(){
                            $scope.showUploads = false;
                        });

                    }]
                };
            });
    }
});