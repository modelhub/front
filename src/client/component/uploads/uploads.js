define('uploads/uploads', [
    'styler',
    'text!uploads/uploads.css',
    'text!uploads/uploads.html',
    'text!uploads/uploads.txt.json'
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
            .directive('mhUploads', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$rootScope', '$scope', '$window', 'api', 'event', 'i18n', function($rootScope, $scope, $window, api, event, i18n){

                        i18n($scope, txt);

                    }]
                };
            });
    }
});