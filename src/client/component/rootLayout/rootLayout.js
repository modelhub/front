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
                    controller: ['$location', '$rootScope', '$scope', 'EVENT', function($location, $rootScope, $scope, EVENT) {

                        $scope.showMainMenu = true;

                        $scope.showMainMenuBtnClick = function(){
                            $scope.showMainMenu = true;
                            $rootScope.$broadcast(EVENT.SHOW_MAIN_MENU);
                        };

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $scope.showMainMenu = false;
                        });

                        $scope.$on('$locationChangeSuccess', function(){
                            var pathParts = $location.path().split('/');
                            if(pathParts[1] === 'projectSpace'){
                                $scope.showProjectSpace = pathParts[2];
                            } else {
                                $scope.showProjectSpace = '';
                            }
                        });

                    }]
                };
            });
    }
});