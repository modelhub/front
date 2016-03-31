define('document/document', [
    'styler',
    'text!document/document.css',
    'text!document/document.html',
    'text!document/document.txt.json'
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
            .directive('mhDocument', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentId: '@'
                    },
                    controller: ['$element', '$location', '$rootScope', '$scope', '$window', 'api', 'currentUser', 'EVENT', 'i18n', function($element, $location, $rootScope, $scope, $window, api, currentUser, EVENT, i18n){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];

                        $scope.my = currentUser();

                        api.v1.treeNode.get([$scope.documentId]).then(function(nodes){
                            $scope.document = nodes[0]
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
                            if ($scope.newType === 'documentVersion') {
                                $scope.newVersionBtnClick();
                            } else {
                                $scope.newVersionBtnClick();
                            }
                        });

                        $scope.$on(EVENT.CREATE_FORM_SUCCESS, function(){
                            $scope.newVersionBtnClick();
                        });

                        var runStatusCheck;
                        runStatusCheck = function(docVer){
                            var matches = docVer.status.match(/(registered|pending|inprogress)/);
                            if(matches && matches.length > 0){
                                $window.setTimeout(function(){
                                    api.v1.documentVersion.get([docVer.id]).then(function(docVers){
                                        docVer.status = docVers[0].status;
                                        if(docVer.status === 'success'){
                                            api.v1.sheet.getForDocumentVersion(docVer.id, 0, 1, 'nameAsc').then(function(result){
                                                docVer.firstSheet = result.results[0].thumbnails;
                                            });
                                        } else {
                                            runStatusCheck(docVer);
                                        }
                                    });
                                }, 10000);
                            }
                        };

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
                                api.v1.helper.getDocumentVersionsWithFirstSheetInfo($scope.documentId, offset, limit, 'versionDesc').then(function (result) {
                                    totalResults = result.totalResults;
                                    if(result && result.results) {
                                        for (var i = 0; i < result.results.length; i++) {
                                            runStatusCheck(result.results[i]);
                                        }
                                    }
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
                            $location.path('/documentVersion/' + version.id);
                        };

                        $scope.versionSheetsClick = function(version){
                            $location.path('/sheets/'+version.id);
                        };

                        loadNextVersionBatch();
                    }]
                };
            });
    }
});