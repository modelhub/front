define('breadcrumbs/breadcrumbs', [
    'styler',
    'text!breadcrumbs/breadcrumbs.css',
    'text!breadcrumbs/breadcrumbs.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhBreadcrumbs', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        entityType: '@',
                        entityId: '@'
                    },
                    controller: ['$scope', function($scope){

                    }]
                };
            });
    }
});