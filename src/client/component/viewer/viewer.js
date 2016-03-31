define('viewer/viewer', [
    'styler',
    'text!viewer/viewer.css',
    'text!viewer/viewer.html',
    'text!viewer/viewer.txt.json'
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
            .directive('mhViewer', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        comStr: '@'
                    },
                    controller: ['$element', '$scope', '$rootScope', '$window', 'EVENT', 'i18n', 'lmv', function($element, $scope, $rootScope, $window, EVENT, i18n, lmv){

                        i18n($scope, txt);

                        if ($scope.comStr){
                            $scope.comObj = $window.JSON.parse($scope.comStr);
                        }

                        $scope.state = 'init';

                        $scope.$on('$destroy', function(){
                            if($scope.viewer){
                                $scope.viewer.finish();
                            }
                        });


                        lmv($element[0].getElementsByClassName('lmv')[0]).then(function(viewer){

                            $scope.viewer = viewer;
                            $scope.state = 'ready';

                            if($scope.comObj){
                                for(var i = 0; i < $scope.comObj.sheets.length; i++){
                                    viewer.loadSheet($scope.comObj.sheets[i].id, $scope.comObj.sheets[i].manifest);
                                }
                            }

                            $scope.$on(EVENT.HIDE_MAIN_MENU, function(){
                                $window.setTimeout(viewer.resize, 0);
                            });
                            $scope.$on(EVENT.SHOW_MAIN_MENU, function(){
                                $window.setTimeout(viewer.resize, 0);
                            });

                        }, function(){

                            $scope.state = 'error';

                        });

                    }]
                };
            });
    }
});