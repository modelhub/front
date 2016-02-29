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
            .directive('cpDocument', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: false,
                    controller:['$rootScope', '$scope', 'i18n', 'sheetExtractor',
                        function($rootScope, $scope, i18n, sheetExtractor){
                        i18n($scope, txt);

                        $scope.getSheets = sheetExtractor.getSheets;

                        var selectedSheetFetchDataByDocUrns = {};
                        $scope.sheetSelected = function(docUrn, sheet, isLeaflet){
                            var oldSheetFetchData = selectedSheetFetchDataByDocUrns[docUrn];
                            if (sheet) {
                                var newSheetFetchData = sheetExtractor.getSheetFetchData(sheet, isLeaflet);

                                $rootScope.$broadcast('load_sheet', newSheetFetchData);
                                selectedSheetFetchDataByDocUrns[docUrn] = sheet;

                                if(oldSheetFetchData && oldSheetFetchData.urn !== newSheetFetchData.urn){
                                    $rootScope.$broadcast('unload_sheet', oldSheetFetchData);
                                }

                            } else if (oldSheetFetchData){
                                //console.log('unloading sheet '+oldSheetPath);
                                $rootScope.$broadcast('unload_sheet', oldSheetFetchData);
                                selectedSheetFetchDataByDocUrns[docUrn] = null;
                            }
                        };
                    }]
                };
            });
    }
});