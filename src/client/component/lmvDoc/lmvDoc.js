define('lmvDoc/lmvDoc', [
    'styler',
    'text!lmvDoc/lmvDoc.css',
    'text!lmvDoc/lmvDoc.html',
    'text!lmvDoc/lmvDoc.txt.json'
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
            .directive('mhLmvDoc', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        documentVersionId: '@'
                    },
                    controller: ['$element', '$location', '$rootScope', '$scope', '$window', 'api', 'currentUser', 'EVENT', 'i18n', function($element, $location, $rootScope, $scope, $window, api, currentUser, EVENT, i18n){
                        i18n($scope, txt);

                        var scrollEl = $element[0].getElementsByClassName('root')[0];

                        $scope.my = currentUser();
                        $scope.loading = true;

                        var loadNextSheetBatch,
                            offset = 0,
                            limit = 20,
                            totalResults = null,
                            loadingNextSheetBatch = false;
                        $scope.loadingSheets = true;
                        loadNextSheetBatch = function(){
                            if(!loadingNextSheetBatch && !$scope.sheets || totalResults === null || offset < totalResults) {
                                loadingNextSheetBatch = true;
                                $scope.loadingSheets = true;
                                api.v1.sheet.getForDocumentVersion($scope.documentVersionId, offset, limit, 'nameAsc').then(function (result) {
                                    totalResults = result.totalResults;
                                    if (!$scope.sheets){
                                        $scope.sheets = result.results;
                                    } else {
                                        $scope.sheets.push.apply($scope.sheets, result.results);
                                    }
                                    offset = $scope.sheets.length;
                                    loadingNextSheetBatch = false;
                                    if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                        loadNextSheetBatch();
                                    } else {
                                        $scope.loadingSheets = false;
                                    }
                                }, function (errorId) {
                                    $scope.loadingError = errorId;
                                    $scope.loadingSheets = false;
                                    loadingNextSheetBatch = false;
                                });
                            }
                        };

                        var lastScrollTop = 0;
                        scrollEl.addEventListener('scroll', function(){
                            if (lastScrollTop < scrollEl.scrollTop && scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) < 10){
                                loadNextSheetBatch();
                            }
                            lastScrollTop = scrollEl.scrollTop;
                        });

                        $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                            $window.setTimeout(function(){
                                if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                    loadNextSheetBatch();
                                }
                            }, 100);
                        });

                        function windowResizeHandler(){
                            if (offset < totalResults && scrollEl.scrollHeight <= scrollEl.clientHeight + 150) {
                                loadNextSheetBatch();
                            }
                        }
                        $window.addEventListener('resize', windowResizeHandler);
                        $scope.$on('$destroy', function(){
                            $window.removeEventListener('resize', windowResizeHandler);
                        });

                        $scope.sheetsClick = function(sheet){
                            $location.path('/sheet/'+sheet.id);
                        };

                        var runStatusCheck,
                            timeouts = {};
                        runStatusCheck = function(){
                            var matches = $scope.documentVersion.status.match(/(registered|pending|inprogress)/);
                            if(matches && matches.length > 0){
                                var timeout = $window.setTimeout(function(){
                                    delete timeouts[timeout];
                                    api.v1.documentVersion.get([$scope.documentVersion.id]).then(function(docVers){
                                        $scope.documentVersion = docVers[0];
                                        if($scope.documentVersion.status === 'success'){
                                            loadNextSheetBatch();
                                        } else {
                                            runStatusCheck();
                                        }
                                        $scope.loading = false;
                                    }, function(errorId){
                                        $scope.loadingError = errorId;
                                        $scope.loading = false;
                                    });
                                }, 10000);
                                timeouts[timeout] = timeout;
                            } else if($scope.documentVersion.status === 'success'){
                                loadNextSheetBatch();
                            }
                        };

                        $scope.$on('$destroy', function(){
                            for (var timeout in timeouts) {
                                if (timeouts.hasOwnProperty(timeout)) {
                                    $window.clearTimeout(timeouts[timeout]);
                                }
                            }
                        });

                        api.v1.documentVersion.get([$scope.documentVersionId]).then(function(docVers){
                            $scope.documentVersion = docVers[0];
                            $scope.loading = false;
                            runStatusCheck();
                        }, function(errorId){
                            $scope.loadingError = errorId;
                            $scope.loading = false;
                        });

                    }]
                };
            });
    }
});