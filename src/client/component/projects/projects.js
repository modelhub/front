define('projects/projects', [
    'styler',
    'text!projects/projects.css',
    'text!projects/projects.html',
    'text!projects/projects.txt.json'
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
            .directive('mhProjects', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$element', '$location', '$rootScope', '$scope', 'api', 'currentUser', 'EVENT', 'i18n', function($element, $location, $rootScope, $scope, api, currentUser, EVENT, i18n){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];

                        $scope.my = currentUser();

                        $scope.newProjectBtnClick = function(){
                            if ($scope.selectedControl === 'newProject') {
                                $rootScope.$broadcast(EVENT.HIDE_THUMBNAIL_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_THUMBNAIL_CREATE_FORM);
                                $scope.selectedControl = 'newProject';
                            }
                        };

                        $scope.$on(EVENT.THUMBNAIL_CREATE_FORM_CANCEL, function(){
                            $scope.newProjectBtnClick();
                        });

                        $scope.$on(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, function(event, project){
                            $scope.newProjectBtnClick();
                            $location.path('/folder/'+project.id);
                        });

                        var loadNextProjectBatch,
                            offset = 0,
                            limit = 20,
                            totalResults = null;
                        $scope.loadingProjects = true;
                        loadNextProjectBatch = function(){
                            if(!$scope.projects || totalResults === null || offset < totalResults) {
                                $scope.loadingProjects = true;
                                api.v1.project.getInUserContext($scope.my.id, 'any', offset, limit).then(function (result) {
                                    totalResults = result.totalResults;
                                    if (!$scope.projects){
                                        $scope.projects = result.results;
                                    } else {
                                        $scope.projects.push.apply($scope.projects, result.results);
                                    }
                                    offset = $scope.projects.length;
                                    if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight) {
                                        loadNextProjectBatch();
                                    } else {
                                        $scope.loadingProjects = false;
                                    }
                                }, function (errorId) {
                                    $scope.projectsLoadingError = errorId;
                                    $scope.loadingProjects = false;
                                });
                            }
                        };

                        var lastScrollTop = 0;
                        scrollEl.addEventListener('scroll', function(){
                            if (lastScrollTop < scrollEl.scrollTop && scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) < 10){
                                lastScrollTop = scrollEl.scrollTop;
                                loadNextProjectBatch();
                            }
                        });

                        $scope.projectClick = function(project){
                            $location.path('/folder/'+project.id);
                        };

                        loadNextProjectBatch();
                    }]
                };
            });
    }
});