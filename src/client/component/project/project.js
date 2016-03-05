define('project/project', [
    'styler',
    'text!project/project.css',
    'text!project/project.html',
    'text!project/project.txt.json'
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
            .directive('mhProject', function(){
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