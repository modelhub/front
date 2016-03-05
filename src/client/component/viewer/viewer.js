define('viewer/viewer', [
    'styler',
    'text!viewer/viewer.css',
    'text!viewer/viewer.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhViewer', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$element', '$scope', '$rootScope', 'EVENT', 'lmv', function($element, $scope, $rootScope, EVENT, lmv){
                        lmv($element[0].getElementsByClassName('lmv')[0]).then(function(viewer){
                            console.log(viewer);
                        }, function(err){
                            console.log(err);
                        });
                    }]
                };
            });
    }
});