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
                    controller: ['$element', '$location', '$rootScope', '$scope', '$window', 'currentUser', 'EVENT', 'nav', function($element, $location, $rootScope, $scope, $window, currentUser, EVENT, nav) {
                        var rootEl = $element[0].children[1];
                        rootEl.addEventListener('scroll', function(){
                            if (rootEl.scrollHeight - (rootEl.scrollTop + rootEl.clientHeight) < 10){
                                $rootScope.$broadcast(EVENT.ROOT_SCROLL_BOTTOM);
                            }
                        });
                        var reloadRootViewTimeout;
                        var myId = currentUser().id,
                            onLocationChange = function() {
                            //if the app is extended to have more routes of varying types then this should be deleted and ngRoute should be used instead, but for now, this is fine.
                                var knownBaseRoutes = ['user', 'project', 'folder', 'document', 'documentVersion', 'search', 'uploads'],
                                    pathSegments = $location.path().split('/'),
                                    base = pathSegments[1],
                                    baseArg = pathSegments[2];

                                if (knownBaseRoutes.indexOf(base) === -1 || ((!baseArg || baseArg === "") && base !== 'uploads')) {
                                    nav.goToUser(myId);
                                }

                                if (base === 'search'){
                                    $scope.project = pathSegments[3];
                                }
                                $window.clearTimeout(reloadRootViewTimeout);
                                reloadRootViewTimeout = $window.setTimeout(function(){
                                    $scope.base = base;
                                    $scope.baseArg = baseArg;
                                    $scope.$apply();
                                }, 100);
                                $scope.base = 'reloadRootView';
                            };

                        onLocationChange();
                        $scope.$on('$locationChangeSuccess', onLocationChange);

                        $scope.showViewer = false;

                        $scope.$on(EVENT.SHOW_VIEWER, function(){
                            $scope.showViewer = true;
                        });

                        $scope.$on(EVENT.HIDE_VIEWER, function(){
                            $scope.showViewer = false;
                        });

                    }]
                };
            });
    }
});