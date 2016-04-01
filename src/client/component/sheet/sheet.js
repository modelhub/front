define('sheet/sheet', [
    'styler',
    'text!sheet/sheet.css',
    'text!sheet/sheet.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhSheet', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        sheetId: '@'
                    },
                    controller: ['$scope', 'api', 'EVENT', function($scope, api, EVENT){
                        var viewer,
                            sheet,
                            loadSheet = function(){
                                if(viewer && sheet){
                                    viewer.loadSheet(sheet.id, sheet.manifest);
                                }
                            };

                        $scope.$on(EVENT.VIEWER_READY, function(event, data){
                            if(data.scopeId === $scope.$id){
                                viewer = data.viewer;
                                loadSheet();
                            }
                        });
                        api.v1.sheet.get([$scope.sheetId]).then(function(sheets){
                            sheet = sheets[0];
                            loadSheet();
                        }, function(errorId){
                            $scope.loadingError = errorId;
                        });
                    }]
                };
            });
    }
});