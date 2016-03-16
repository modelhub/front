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
                                        offset = 0;
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