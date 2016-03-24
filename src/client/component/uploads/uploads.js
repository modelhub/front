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
                    controller: ['$scope', 'EVENT', 'i18n', 'uploader', function($scope, EVENT, i18n, uploader){
                        i18n($scope, txt);

                        $scope.uploads = uploader.getUploads();

                        $scope.$on(EVENT.UPLOADS_CHANGED, function(){
                            $scope.uploads = uploader.getUploads();
                        });

                        $scope.clearBtnClick = function(){
                            uploader.clearFinished();
                        };
                    }]
                };
            });
    }
});