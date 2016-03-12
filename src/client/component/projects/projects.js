define('projects/projects', [
    'styler',
    'text!projects/projects.css',
    'text!projects/projects.html',
    'text!projects/projects.txt.json'
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
            .directive('mhProjects', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$scope', 'i18n', function($scope, i18n){
                        i18n($scope, txt);
                    }]
                };
            });
    }
});