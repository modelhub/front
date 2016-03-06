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
                    scope: {},
                    controller: ['$element', '$scope', '$rootScope', 'EVENT', 'i18n', 'lmv', function($element, $scope, $rootScope, EVENT, i18n, lmv){

                        i18n($scope, txt);

                        $scope.state = 'init';

                        lmv($element[0].getElementsByClassName('lmv')[0]).then(function(viewer){

                            $scope.state = 'ready';

                        }, function(){

                            $scope.state = 'error';

                        });

                    }]
                };
            });
    }
});