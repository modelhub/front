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

                        api.v1.treeNode.get([$scope.folderId]).then(function(nodes){
                            $scope.folder = nodes[0];
                            $rootScope.$broadcast(EVENT.GET_PROJECT_SPACE, {projectId: $scope.folder.project, callback: function(){
                                $scope.projectSpaceExists = true;
                            }});
                        });

                        $scope.newFolderBtnClick = function(){
                            $scope.newType = 'folder';
                            if ($scope.selectedControl === 'newFolder') {
                                $rootScope.$broadcast(EVENT.HIDE_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_CREATE_FORM);
                                $scope.selectedControl = 'newFolder';
                            }
                        };

                        $scope.newDocumentBtnClick = function(){
                            $scope.newType = 'document';
                            if ($scope.selectedControl === 'newDocument') {
                                $rootScope.$broadcast(EVENT.HIDE_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_CREATE_FORM);
                                $scope.selectedControl = 'newDocument';
                            }
                        };

                        $scope.newProjectSpaceBtnClick = function(){
                            $scope.newType = 'projectSpace';
                            if ($scope.selectedControl === 'newProjectSpace') {
                                $rootScope.$broadcast(EVENT.HIDE_CREATE_FORM);
                                $scope.selectedControl = '';
                            } else {
                                $rootScope.$broadcast(EVENT.SHOW_CREATE_FORM);
                                $scope.selectedControl = 'newProjectSpace';
                            }
                        };

                        $scope.$on(EVENT.CREATE_FORM_CANCEL, function(){
                            if ($scope.newType === 'folder') {
                                $scope.newFolderBtnClick();
                            } else if ($scope.newType === 'document') {
                                $scope.newDocumentBtnClick();
                            } else if ($scope.newType === 'projectSpace') {
                                $scope.newProjectSpaceBtnClick();
                            }
                        });

                        $scope.$on(EVENT.CREATE_FORM_SUCCESS, function(event, node){
                            if ($scope.newType === 'folder') {
                                $scope.newFolderBtnClick();
                                $location.path('/folder/'+node.id);
                            } else if ($scope.newType === 'document') {
                                $scope.newDocumentBtnClick();
                            } else if ($scope.newType === 'projectSpace') {
                                $scope.newProjectSpaceBtnClick();
                            }
                        });

                        var runStatusCheck,
                            timeouts = {};
                        runStatusCheck = function(doc){
                            if(doc.latestVersion){
                                var matches = doc.latestVersion.status.match(/(registered|pending|inprogress)/);
                                if(matches && matches.length > 0) {
                                    var timeout = $window.setTimeout(function () {
                                        delete timeouts[timeout];
                                        api.v1.documentVersion.get([doc.latestVersion.id]).then(function (docVers) {
                                            doc.latestVersion.status = docVers[0].status;
                                            if (doc.latestVersion.status === 'success') {
                                                api.v1.documentVersion.get([doc.latestVersion.id]).then(function (docVers) {
                                                    doc.latestVersion.sheetCount = docVers[0].sheetCount;
                                                    api.v1.sheet.getForDocumentVersion(doc.latestVersion.id, 0, 1, 'nameAsc').then(function (result) {
                                                        doc.latestVersion.firstSheet = result.results[0];
                                                    });
                                                });
                                            } else {
                                                runStatusCheck(doc);
                                            }
                                        });
                                    }, 10000);
                                    timeouts[timeout] = timeout;
                                }
                            }
                        };

                        $scope.$on('$destroy', function(){
                            for (var timeout in timeouts) {
                                if (timeouts.hasOwnProperty(timeout)) {
                                    $window.clearTimeout(timeouts[timeout]);
                                }
                            }
                        });

                        var loadNextTreeNodeBatch,
                            filter = 'folder',
                            segmentedOffsetCount = 0,
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
                                    if(result && result.results && filter === 'document') {
                                        for (var i = 0; i < result.results.length; i++) {
                                            runStatusCheck(result.results[i]);
                                        }
                                    }
                                    if (!$scope.children){
                                        $scope.children = result.results;
                                    } else {
                                        $scope.children.push.apply($scope.children, result.results);
                                    }
                                    if (filter === 'folder') {
                                        offset = $scope.children.length;
                                    } else {
                                        offset = $scope.children.length - segmentedOffsetCount;
                                    }
                                    loadingNextTreeNodeBatch = false;
                                    if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                        loadNextTreeNodeBatch();
                                    } else if (filter === 'folder' || filter === 'projectSpace' ){
                                        if(filter === 'folder') {
                                            filter = 'projectSpace';
                                        } else {
                                            filter = 'document';
                                        }
                                        limit = defaultLimit - (offset % defaultLimit);
                                        offset = 0;
                                        segmentedOffsetCount = $scope.children.length;
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
                                if (filter === 'folder') {
                                    api.v1.treeNode.getChildren($scope.folderId, filter, offset, limit, 'nameAsc').then(successCallback, errorCallback);
                                } else if (filter === 'projectSpace') {
                                    api.v1.helper.getChildrenProjectSpacesWithLatestVersion($scope.folderId, offset, limit, 'nameAsc').then(successCallback, errorCallback);
                                } else if (filter === 'document') {
                                    api.v1.helper.getChildrenDocumentsWithLatestVersionAndFirstSheetInfo($scope.folderId, offset, limit, 'nameAsc').then(successCallback, errorCallback);
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

                        $scope.childClick = function(child) {
                            if (child.nodeType === 'folder') {
                                $location.path('/folder/' + child.id);
                            } else if (child.nodeType === 'document') {
                                if(child.latestVersion.sheetCount === 1){
                                    $location.path('/sheet/' + child.latestVersion.firstSheet.id);
                                } else {
                                    $location.path('/documentVersion/' + child.latestVersion.id);
                                }
                            } else if (child.nodeType === 'viewerState') {
                                //TODO trigger event to load sheets into aggregation viewer
                            }
                        };

                        $scope.childVersionsClick = function(child){
                            $location.path('/'+child.nodeType+'/'+child.id);
                        };

                        loadNextTreeNodeBatch();
                    }]
                };
            });
    }
});