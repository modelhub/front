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
                    controller: ['$scope', 'api', function($scope, api){
                        api.v1.sheet.get([$scope.sheetId]).then(function(sheets){
                            $scope.comObj = {
                                sheets: sheets
                            };
                        }, function(errorId){
                            $scope.loadingError = errorId;
                        });
                    }]
                };
            });
    }
});