define('folder/folder', [
    'styler',
    'text!folder/folder.css',
    'text!folder/folder.html',
    'text!folder/folder.txt.json'
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
            .directive('mhFolder', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        folderId: '@'
                    },
                    controller: ['$element', '$location', '$scope', '$window', 'api', 'currentUser', 'i18n', 'thumbnail', function($element, $location, $scope, $window, api, currentUser, i18n, thumbnail){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];
                        var fileEl = $element[0].getElementsByClassName('new-file-input')[0];

                        $scope.my = currentUser();

                        $scope.newFolderBtnClick = function(){
                            $scope.newFolderName = '';
                            if ($scope.selectedControl === 'newFolder') {
                                $scope.selectedControl = '';
                            } else {
                                $scope.selectedControl = 'newFolder';
                            }
                        };

                        $scope.newFileBtnClick = function(){
                            fileEl.value = '';
                            $scope.newFileName = '';
                            if ($scope.selectedControl === 'newFile') {
                                $scope.selectedControl = '';
                            } else {
                                $scope.selectedControl = 'newFile';
                            }
                        };

                        $scope.newFileInputBtnClick = function(){
                            fileEl.click();
                        };

                        var processingThumbnail = false,
                            resizedImage = null,
                            resizedImageName = null;
                        $scope.newFileInputChange = function(){
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

                        var sendingCreateFolderApiRequest = false;
                        $scope.createNewFolderBtnClick = function(){
                            if(!sendingCreateFolderApiRequest){
                                sendingCreateFolderApiRequest = true;
                                api.v1.treeNode.createFolder($scope.folderId, $scope.newFolderName).then(function(folder){
                                    sendingCreateFolderApiRequest = false;
                                    $scope.selectedControl = '';
                                    $location.path('/folder/'+folder.id);
                                }, function(errorId){
                                    //TODO
                                    sendingCreateFolderApiRequest = false;
                                });
                            }
                        };

                        var sendingCreateFileApiRequest = false;
                        $scope.createNewFileBtnClick = function(){
                            if(!sendingCreateFileApiRequest && fileEl.files[0]){
                                sendingCreateFileApiRequest = true;
                                api.v1.treeNode.createDocument($scope.folderId, $scope.newFileName, '', fileEl.files[0]).then(function(folder){
                                    sendingCreateFileApiRequest = false;
                                    $scope.selectedControl = '';
                                }, function(errorId){
                                    //TODO
                                    sendingCreateFileApiRequest = false;
                                });
                            }
                        };

                        var loadNextTreeNodeBatch,
                            filter = 'folder',
                            offset = 0,
                            defaultLimit = 20,
                            limit = defaultLimit,
                            totalResults = null;
                        $scope.loadingChildren = true;
                        loadNextTreeNodeBatch = function(){
                            if(filter) {
                                $scope.loadingChildren = true;
                                api.v1.treeNode.getChildren($scope.folderId, filter, offset, limit).then(function (result) {
                                    limit = defaultLimit;
                                    totalResults = result.totalResults;
                                    if (!$scope.children){
                                        $scope.children = result.results;
                                    } else {
                                        $scope.children.push.apply($scope.children, result.results);
                                    }
                                    offset = $scope.children.length;
                                    if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight) {
                                        loadNextTreeNodeBatch();
                                    } else if (filter === 'folder' ){
                                        filter = 'document';
                                        limit = defaultLimit - (offset % defaultLimit);
                                        if (limit <= defaultLimit || scrollEl.scrollHeight <= scrollEl.clientHeight) {
                                            loadNextTreeNodeBatch();
                                        } else {
                                            $scope.loadingChildren = false;
                                        }
                                    } else {
                                        filter = null;
                                        $scope.loadingChildren = false;
                                    }
                                }, function (errorId) {
                                    $scope.childrenLoadingError = errorId;
                                    $scope.loadingChildren = false;
                                });
                            }
                        };

                        var lastScrollTop = 0;
                        scrollEl.addEventListener('scroll', function(){
                            if (lastScrollTop < scrollEl.scrollTop && scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) < 10){
                                lastScrollTop = scrollEl.scrollTop;
                                loadNextTreeNodeBatch();
                            }
                        });

                        $scope.childClick = function(child){
                            $location.path('/'+child.nodeType+'/'+child.id);
                        };

                        loadNextTreeNodeBatch();
                    }]
                };
            });
    }
});