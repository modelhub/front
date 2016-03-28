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
                    controller: ['$location', '$scope', 'EVENT', 'i18n', 'uploader', function($location, $scope, EVENT, i18n, uploader){
                        i18n($scope, txt);

                        $scope.uploads = uploader.getUploads();

                        $scope.$on(EVENT.UPLOADS_CHANGED, function(){
                            $scope.uploads = uploader.getUploads();
                            $scope.$evalAsync();
                        });

                        $scope.clearBtnClick = function(){
                            uploader.clearFinished();
                        };

                        $scope.uploadClick = function(upload) {
                            switch(upload.newType){
                                case 'document':
                                    $location.path('/folder/'+upload.parentId);
                                    break;
                                case 'documentVersion':
                                    $location.path('/document/'+upload.parentId);
                                    break;
                            }
                        };
                    }]
                };
            });
    }
});