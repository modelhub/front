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
                    controller: ['$element', '$location', '$scope', '$window', 'api', 'currentUser', 'i18n', 'thumbnail', function($element, $location, $scope, $window, api, currentUser, i18n, thumbnail){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];
                        var fileEl = $element[0].getElementsByClassName('new-project-thumbnail-input')[0];
                        var imgEl = $element[0].getElementsByClassName('new-project-thumbnail-preview')[0];

                        $scope.my = currentUser();

                        $scope.newProjectBtnClick = function(){
                            fileEl.value = '';
                            imgEl.src = '';
                            $scope.newProjectName = '';
                            if ($scope.selectedControl === 'newProject') {
                                $scope.selectedControl = '';
                            } else {
                                $scope.selectedControl = 'newProject';
                            }
                        };

                        $scope.newProjectThumbnailBtnClick = function(){
                            fileEl.click();
                        };

                        var processingThumbnail = false,
                            resizedImage = null,
                            resizedImageName = null;
                        $scope.newProjectThumbnailFileChange = function(){
                            if (!processingThumbnail) {
                                processingThumbnail = true;
                                thumbnail(fileEl.files[0], 196).then(function (data) {
                                    resizedImage = data.blob;
                                    resizedImageName = data.name;
                                    if(data.image) {
                                        imgEl.src = data.image.src;
                                    } else {
                                        imgEl.src = '';
                                    }
                                    processingThumbnail = false;
                                }, function (error) {
                                    processingThumbnail = false;
                                });
                            }
                        };

                        var sendingCreateApiRequest = false;
                        $scope.createNewProjectBtnClick = function(){
                            if(!processingThumbnail && !sendingCreateApiRequest){
                                sendingCreateApiRequest = true;
                                api.v1.project.create($scope.newProjectName, resizedImageName, resizedImage).then(function(project){
                                    sendingCreateApiRequest = false;
                                    $scope.selectedControl = '';
                                    $location.path('/folder/'+project.id);
                                }, function(errorId){
                                    //TODO
                                    sendingCreateApiRequest = false;
                                });
                            }
                        };

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