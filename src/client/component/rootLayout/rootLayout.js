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
                    controller: ['$location', '$scope', 'currentUser', 'EVENT', 'nav', function($location, $scope, currentUser, EVENT, nav) {

                        var currentUserId = currentUser().id,
                            onLocationChange = function() {
                            //if the app is extended to have more routes of varying types then this should be deleted and ngRoute should be used instead, but for now, this is fine.
                                var knownBaseRoutes = ['user', 'project', 'folder', 'document', 'documentVersion', 'search'],
                                    pathSegments = $location.path().split('/'),
                                    base = pathSegments[1],
                                    baseArg = pathSegments[2];

                                if (knownBaseRoutes.indexOf(base) === -1 || !baseArg || baseArg === "") {
                                    nav.goToUser(currentUserId);
                                }

                                if (base === 'search'){
                                    $scope.project = pathSegments[3];
                                }
                                $scope.base = base;
                                $scope.baseArg = baseArg;
                            };

                        onLocationChange();
                        $scope.$on('$locationChangeSuccess', onLocationChange);

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