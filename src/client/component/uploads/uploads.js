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
                    controller: ['$scope', 'i18n', 'uploader', function($scope, i18n, uploader){
                        i18n($scope, txt);
                    }]
                };
            });
    }
});