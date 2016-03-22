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
                    controller: ['$element', '$location', '$rootScope', '$scope', '$window', 'api', 'currentUser', 'EVENT', 'i18n', function($element, $location, $rootScope, $scope, $window, api, currentUser, EVENT, i18n){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];

                        $scope.my = currentUser();

                        $scope.newFolderBtnClick = function(){
                            $scope.newType = 'folder';
                            if ($scope.selectedControl === 'newFolder') {
                                $rootScope.$broadcast(EVENT.HIDE_THUMBNAIL_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_THUMBNAIL_CREATE_FORM);
                                $scope.selectedControl = 'newFolder';
                            }
                        };

                        $scope.newDocumentBtnClick = function(){
                            $scope.newType = 'document';
                            if ($scope.selectedControl === 'newDocument') {
                                $rootScope.$broadcast(EVENT.HIDE_THUMBNAIL_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_THUMBNAIL_CREATE_FORM);
                                $scope.selectedControl = 'newDocument';
                            }
                        };

                        $scope.$on(EVENT.THUMBNAIL_CREATE_FORM_CANCEL, function(){
                            if ($scope.newType === 'folder') {
                                $scope.newFolderBtnClick();
                            } else {
                                $scope.newDocumentBtnClick();
                            }
                        });

                        $scope.$on(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, function(event, node){
                            if ($scope.newType === 'folder') {
                                $scope.newFolderBtnClick();
                                $location.path('/folder/'+node.id);
                            } else {
                                $scope.newDocumentBtnClick();
                            }
                        });

                        var loadNextTreeNodeBatch,
                            filter = 'folder',
                            folderCount = 0,
                            offset = 0,
                            defaultLimit = 20,
                            limit = defaultLimit,
                            totalResults = null,
                            loadingNextTreeNodeBatch = false;
                        $scope.loadingChildren = false;
                        loadNextTreeNodeBatch = function(){
                            if(filter && !loadingNextTreeNodeBatch) {
                                loadingNextTreeNodeBatch = true;
                                $scope.loadingChildren = true;
                                var successCallback = function (result) {
                                    limit = defaultLimit;
                                    totalResults = result.totalResults;
                                    if (!$scope.children){
                                        $scope.children = result.results;
                                    } else {
                                        $scope.children.push.apply($scope.children, result.results);
                                    }
                                    if (filter === 'folder') {
                                        offset = $scope.children.length;
                                    } else {
                                        offset = $scope.children.length - folderCount;
                                    }
                                    loadingNextTreeNodeBatch = false;
                                    if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                        loadNextTreeNodeBatch();
                                    } else if (filter === 'folder' ){
                                        filter = 'document';
                                        limit = defaultLimit - (offset % defaultLimit);
                                        offset = 0;
                                        folderCount = $scope.children.length;
                                        if (limit <= defaultLimit || scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                            loadNextTreeNodeBatch();
                                        } else {
                                            $scope.loadingChildren = false;
                                        }
                                    } else if (offset >= totalResults) {
                                        filter = null;
                                        $scope.loadingChildren = false;
                                    } else {
                                        $scope.loadingChildren = false;
                                    }
                                };
                                var errorCallback = function(errorId) {
                                    $scope.childrenLoadingError = errorId;
                                    $scope.loadingChildren = false;
                                    loadingNextTreeNodeBatch = false;
                                };
                                if (filter !== 'document') {
                                    api.v1.treeNode.getChildren($scope.folderId, filter, offset, limit, 'nameAsc').then(successCallback, errorCallback);
                                } else {
                                    api.v1.helper.treeNode.getChildrenDocumentsWithLatestVersionAndFirstSheet($scope.folderId, offset, limit, 'nameAsc').then(successCallback, errorCallback);
                                }
                            }
                        };

                        var lastScrollTop = 0;
                        scrollEl.addEventListener('scroll', function(){
                            if (lastScrollTop < scrollEl.scrollTop && scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) < 10){
                                loadNextTreeNodeBatch();
                            }
                            lastScrollTop = scrollEl.scrollTop;
                        });

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $window.setTimeout(function(){
                                if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                    loadNextTreeNodeBatch();
                                }
                            }, 100);
                        });

                        function windowResizeHandler(){
                            if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                loadNextTreeNodeBatch();
                            }
                        }
                        $window.addEventListener('resize', windowResizeHandler);
                        $scope.$on('$destroy', function(){
                            $window.removeEventListener('resize', windowResizeHandler);
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