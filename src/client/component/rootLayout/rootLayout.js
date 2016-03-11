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
                    controller: ['$location', '$scope', 'EVENT', function($location, $scope, EVENT) {

                        $scope.showMainMenu = false;
                        $scope.showAggregationViewer = false;

                        $scope.showMainMenuBtnClick = function(){
                            $scope.showMainMenu = true;
                        };

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $scope.showMainMenu = false;
                        });

                        $scope.$on('$locationChangeSuccess', function(){
                            $scope.showAggregationViewer = $location.path().substring(1) === 'aggregation';
                        });

                    }]
                };
            });
    }
});