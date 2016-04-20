define('projectSpace/projectSpace', [
    'styler',
    'text!projectSpace/projectSpace.css',
    'text!projectSpace/projectSpace.html',
    'text!projectSpace/projectSpace.txt.json'
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
            .directive('mhProjectSpace', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        projectSpaceId: '@'
                    },
                    controller: ['$element', '$location', '$rootScope', '$scope', '$window', 'api', 'currentUser', 'EVENT', 'i18n', function($element, $location, $rootScope, $scope, $window, api, currentUser, EVENT, i18n){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];

                        $scope.my = currentUser();

                        api.v1.treeNode.get([$scope.projectSpaceId]).then(function(nodes){
                            $scope.projectSpace = nodes[0];
                            $rootScope.$broadcast(EVENT.GET_PROJECT_SPACE, {projectId: $scope.projectSpace.project, callback: function(data){
                                if(data.sheetTransforms.length > 1) {
                                    $scope.projectSpaceExists = true;
                                }
                            }});
                        });

                        $scope.newVersionBtnClick = function(){
                            if ($scope.selectedControl === 'newVersion') {
                                $rootScope.$broadcast(EVENT.HIDE_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_CREATE_FORM);
                                $scope.selectedControl = 'newVersion';
                            }
                        };

                        $scope.$on(EVENT.CREATE_FORM_CANCEL, function(){
                            if ($scope.newType === 'projectSpaceVersion') {
                                $scope.newVersionBtnClick();
                            } else {
                                $scope.newVersionBtnClick();
                            }
                        });

                        $scope.$on(EVENT.CREATE_FORM_SUCCESS, function(){
                            $scope.newVersionBtnClick();
                        });

                        var loadNextVersionBatch,
                            offset = 0,
                            limit = 20,
                            totalResults = null,
                            loadingNextVersionBatch = false;
                        $scope.loadingVersions = true;
                        loadNextVersionBatch = function(){
                            if(!loadingNextVersionBatch && !$scope.versions || totalResults === null || offset < totalResults) {
                                loadingNextVersionBatch = true;
                                $scope.loadingVersions = true;
                                api.v1.projectSpaceVersion.getForProjectSpace($scope.projectSpaceId, offset, limit, 'versionDesc').then(function (result) {
                                    totalResults = result.totalResults;
                                    if (!$scope.versions){
                                        $scope.versions = result.results;
                                    } else {
                                        $scope.versions.push.apply($scope.versions, result.results);
                                    }
                                    offset = $scope.versions.length;
                                    loadingNextVersionBatch = false;
                                    if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                        loadNextVersionBatch();
                                    } else {
                                        $scope.loadingVersions = false;
                                    }
                                }, function (errorId) {
                                    $scope.versionsLoadingError = errorId;
                                    $scope.loadingVersions = false;
                                    loadingNextVersionBatch = false;
                                });
                            }
                        };

                        var lastScrollTop = 0;
                        scrollEl.addEventListener('scroll', function(){
                            if (lastScrollTop < scrollEl.scrollTop && scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) < 10){
                                loadNextVersionBatch();
                            }
                            lastScrollTop = scrollEl.scrollTop;
                        });

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $window.setTimeout(function(){
                                if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                    loadNextVersionBatch();
                                }
                            }, 100);
                        });

                        function windowResizeHandler(){
                            if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                loadNextVersionBatch();
                            }
                        }
                        $window.addEventListener('resize', windowResizeHandler);
                        $scope.$on('$destroy', function(){
                            $window.removeEventListener('resize', windowResizeHandler);
                        });

                        $scope.versionClick = function(version) {
                            if (version.sheetTransformCount === 1) {
                                $location.path('/sheet/' + version.firstSheet.id);
                            } else {
                                $location.path('/documentVersion/' + version.id);
                            }
                        };

                        $scope.sheetsClick = function(version) {
                            $location.path('/documentVersion/' + version.id);
                        };

                        loadNextVersionBatch();
                    }]
                };
            });
    }
});