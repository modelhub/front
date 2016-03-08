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
    var searchEl;

    return function(ngModule){
        ngModule
            .directive('mhHeader', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$element', '$rootScope', '$scope', 'currentUser', 'EVENT', 'i18n', 'nav', function($element, $rootScope, $scope, currentUser, EVENT, i18n, nav){

                        i18n($scope, txt);

                        $scope.user = currentUser();

                        $scope.globalSearch = '';
                        $element[0].getElementsByTagName('input')[0].addEventListener('keypress', function(e){
                            if(e.keyCode == 13) { //enter
                                var globalSearch = $scope.globalSearch.trim();
                                if (globalSearch.length > 0) {
                                    $scope.globalSearch = '';
                                    deactivateViewer();
                                    nav.goToSearch(globalSearch);
                                }
                            }
                        });

                        $scope.avatarClick = function() {
                            deactivateViewer();
                            nav.goToUser($scope.user.id);
                        };

                        $scope.viewerActive = false;

                        $scope.viewerTabClick = function(){
                            $scope.viewerActive = !$scope.viewerActive;
                            $rootScope.$broadcast(EVENT.HIDE_UPLOADS);
                            if($scope.viewerActive){
                                $rootScope.$broadcast(EVENT.SHOW_VIEWER);
                            } else {
                                $rootScope.$broadcast(EVENT.HIDE_VIEWER);
                            }
                        };
                        $scope.uploadsTabClick = function(){
                            deactivateViewer();
                            nav.goToUploads();
                        };

                        $scope.$on('$locationChangeSuccess', deactivateViewer);
                        function deactivateViewer(){
                            if($scope.viewerActive){
                                $scope.viewerTabClick();
                            }
                        }
                    }]
                };
            });
    }
});