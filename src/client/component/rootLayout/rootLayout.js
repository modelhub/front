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
                    controller: ['$route', '$scope', 'EVENT', function($route, $scope, EVENT) {

                        $scope.showMainMenu = false;
                        $scope.showAggregationViewer = false;

                        $scope.showMainMenuBtnClick = function(){
                            $route.updateParams({showMainMenu: 'true'});
                        };

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $route.updateParams({showMainMenu: null});
                        });

                        $scope.$on(EVENT.SHOW_AGGREGATION_VIEWER, function(){
                            $route.updateParams({showAggregationViewer: 'true'});
                        });

                        $scope.$on(EVENT.HIDE_AGGREGATION_VIEWER, function(){
                            $route.updateParams({showAggregationViewer: null});
                        });

                        $scope.$on('$routeChangeSuccess', function(){
                            $scope.showAggregationViewer = $route.current.params.showAggregationViewer === 'true';
                            $scope.showMainMenu = $route.current.params.showMainMenu === 'true';
                        });

                    }]
                };
            });
    }
});