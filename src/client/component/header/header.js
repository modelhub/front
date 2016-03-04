define('header/header', [
    'styler',
    'text!header/header.css',
    'text!header/header.html',
    'text!header/header.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    return function(ngModule){
        ngModule
            .directive('mhHeader', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$rootScope', '$scope', '$window', 'api', 'EVENT', 'i18n', function($rootScope, $scope, $window, api, EVENT, i18n){

                        i18n($scope, txt);

                        api.v1.user.getCurrent().then(function(user){
                            $scope.user = user;
                        });

                        $scope.avatarClick = function() {
                            $window.location.assign('/#/user/me');
                        };

                        $scope.viewerActive = false;
                        $scope.uploadsActive = false;

                        $scope.viewerTabClick = function(){
                            $scope.viewerActive = !$scope.viewerActive;
                            $scope.uploadsActive = false;
                            $rootScope.$broadcast(EVENT.HIDE_UPLOADS);
                            if($scope.viewerActive){
                                $rootScope.$broadcast(EVENT.SHOW_VIEWER);
                            } else {
                                $rootScope.$broadcast(EVENT.HIDE_VIEWER);
                            }
                        };
                        $scope.uploadsTabClick = function(){
                            $scope.uploadsActive = !$scope.uploadsActive;
                            $scope.viewerActive = false;
                            $rootScope.$broadcast(EVENT.HIDE_VIEWER);
                            if($scope.uploadsActive){
                                $rootScope.$broadcast(EVENT.SHOW_UPLOADS);
                            } else {
                                $rootScope.$broadcast(EVENT.HIDE_UPLOADS);
                            }
                        };
                    }]
                };
            });
    }
});