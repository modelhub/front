define('user/user', [
    'styler',
    'text!user/user.css',
    'text!user/user.html',
    'text!user/user.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    /* Utility function to convert a canvas to a BLOB */
    var dataURLToBlob = function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];

            return new Blob([raw], {type: contentType});
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }
    /* End Utility function to convert a canvas to a BLOB      */

    return function(ngModule){
        ngModule
            .directive('mhUser', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        userId: '@'
                    },
                    controller: ['$document', '$element', '$scope', '$window', 'api', 'currentUser', 'EVENT', 'i18n', 'logout', 'nav', function($document, $element, $scope, $window, api, currentUser, EVENT, i18n, logout, nav){

                        i18n($scope, txt);

                        $scope.myId = currentUser().id;

                        $scope.status = 'init';

                        $scope.logout = logout;

                        $scope.newProjectClick = function(){
                            $scope.showNewProjectForm = true;
                        };

                        var creatingProject = false;
                        $scope.createNewProjectClick = function(){
                            if(!creatingProject) {
                                creatingProject = true;
                                var file = $element[0].getElementsByClassName('new-project-image-input')[0].files[0];
                                if (file && file.type.match(/image.*/)) {
                                    var reader = new $window.FileReader();
                                    reader.onload = function (readerEvent) {
                                        var image = new Image();
                                        image.onload = function () {
                                            // Resize the image
                                            var canvas = document.createElement('canvas'),
                                                max_size = 176,
                                                width = image.width,
                                                height = image.height,
                                                size = width,
                                                srcDim = width,
                                                srcX = 0,
                                                srcY = 0;
                                            if(width < height){
                                                srcY = (height - width) / 2;
                                                if (width > max_size) {
                                                    size = max_size;
                                                }
                                            }else{
                                                size = height;
                                                srcDim = height;
                                                srcX = (width - height) / 2;
                                                if (height > max_size) {
                                                    size = max_size;
                                                }
                                            }
                                            canvas.width = size;
                                            canvas.height = size;
                                            canvas.getContext('2d').drawImage(image, srcX, srcY, srcDim, srcDim, 0, 0, size, size);
                                            var dataUrl = canvas.toDataURL(file.type);
                                            var resizedImage = dataURLToBlob(dataUrl);
                                            _createProjectApiCall(file.name, resizedImage);
                                        }
                                        image.src = readerEvent.target.result;
                                    }
                                    reader.readAsDataURL(file);
                                } else {
                                    _createProjectApiCall("", null);
                                }
                            }
                        };

                        function _createProjectApiCall(fileName, file) {
                            api.v1.project.create($scope.newProjectName, $scope.newProjectDescription, fileName, file).then(function(project){
                                nav.goToProject(project.id);
                                creatingProject = false;
                            }, function(errorId){
                                $scope.createProjectErrorId = errorId;
                                creatingProject = false;
                            });
                        }

                        $scope.cancelNewProjectClick = function(){
                            $scope.showNewProjectForm = false;
                            $scope.newProjectName = "";
                            $scope.newProjectDescription = "";
                            $element[0].getElementsByClassName('new-project-image-input')[0].value = null;
                            $scope.createProjectErrorId = null;
                        };

                        api.v1.user.get([$scope.userId]).then(function (users) {
                            if (users.length === 0) {
                                $scope.status = 'noSuchUser';
                            } else {
                                $scope.status = 'ready';
                                $scope.user = users[0];
                            }
                        }, function (errorId) {
                            $scope.status = 'error';
                            $scope.errorId = errorId;
                        });

                        api.v1.user.getDescription($scope.userId).then(function(description){
                            $scope.user.description = description;
                        },function(errorId){
                            $scope.descriptionErrorId = errorId;
                        });

                        $scope.projects = [];
                        var currentOffset = 0,
                            currentTotalResults = 0,
                            defaultBatchSize = 50,
                            currentBatchSize = defaultBatchSize,
                            currentApiFunc = api.v1.project.getInUserInviteContext,
                            getNextProjectBatch = function(){
                                if (currentApiFunc) {
                                    currentApiFunc($scope.userId, 'any', currentOffset, currentBatchSize, 'nameAsc').then(function (result) {
                                        currentTotalResults = result.totalResults;
                                        $scope.projects.push.apply($scope.projects, result.results);
                                        if (currentOffset + currentBatchSize >= currentTotalResults) {
                                            currentBatchSize += currentOffset - currentTotalResults;
                                            currentOffset = 0;
                                            if (currentApiFunc === api.v1.project.getInUserInviteContext){
                                                currentApiFunc = api.v1.project.getInUserContext;
                                            } else {
                                                currentApiFunc = null;
                                            }
                                            if (currentBatchSize > 0){
                                                getNextProjectBatch()
                                            } else {
                                                currentOffset = currentBatchSize;
                                                currentBatchSize = defaultBatchSize;
                                            }
                                        } else {
                                            currentOffset += currentBatchSize;
                                            currentBatchSize = defaultBatchSize;
                                        }
                                    }, function (errorId) {
                                        $scope.invitedProjectsErrorId = errorId;
                                    });
                                }
                            };

                        getNextProjectBatch();
                        $scope.$on(EVENT.ROOT_SCROLL_BOTTOM, getNextProjectBatch);
                    }]
                };
            });
    }
});