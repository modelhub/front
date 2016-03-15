define('thumbnailCreateForm/thumbnailCreateForm', [
    'styler',
    'text!thumbnailCreateForm/thumbnailCreateForm.css',
    'text!thumbnailCreateForm/thumbnailCreateForm.html',
    'text!thumbnailCreateForm/thumbnailCreateForm.txt.json'
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
            .directive('mhThumbnailCreateForm', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        newType: '@',
                        parentId: '@'
                    },
                    controller: ['$element', '$rootScope', '$scope', 'api', 'EVENT', 'i18n', 'thumbnail', function($element, $rootScope, $scope, api, EVENT, i18n, thumbnail){
                        i18n($scope, txt);

                        var fileEl = $element[0].getElementsByClassName('new-file-input')[0],
                            imgEl = $element[0].getElementsByTagName('img')[0];

                        $scope.$on(EVENT.HIDE_THUMBNAIL_CREATE_FORM, function(){
                            fileEl.value = '';
                            imgEl.src = '';
                            $scope.name = '';
                            $scope.showImgEl = false;
                        });

                        $scope.newFileInputBtnClick = function(){
                            if (!processingThumbnail) {
                                fileEl.click();
                            }
                        };

                        $scope.showImgEl = false;
                        $scope.multiFiles = false;

                        var processingThumbnail = false,
                            resizedImage = null,
                            resizedImageName = null;
                        $scope.newFileInputChange = function(){
                            if (!processingThumbnail) {
                                if (fileEl.files.length === 1) {
                                    $scope.multiFiles = false;
                                    processingThumbnail = true;
                                    thumbnail(fileEl.files[0], 196).then(function (data) {
                                        resizedImage = data.blob;
                                        resizedImageName = data.name;
                                        if (data.image) {
                                            imgEl.src = data.image.src;
                                            $scope.showImgEl = true;
                                        } else {
                                            $scope.showImgEl = false;
                                            imgEl.src = '';
                                        }
                                        processingThumbnail = false;
                                    }, function (error) {
                                        processingThumbnail = false;
                                        $scope.showImgEl = false;
                                        imgEl.src = '';
                                        fileEl.value= '';
                                    });
                                } else if (fileEl.files.length > 1){
                                    $scope.showImgEl = false;
                                    $scope.multiFiles = true;
                                } else {
                                    $scope.multiFiles = false;
                                    $scope.showImgEl = false;
                                }
                            }
                        };

                        var sendingCreateApiRequest = false;
                        $scope.createBtnClick = function(){
                            if(!sendingCreateApiRequest && !processingThumbnail){
                                sendingCreateApiRequest = true;
                                switch($scope.newType){
                                    case 'project':
                                        sendingCreateApiRequest = true;
                                        api.v1.project.create($scope.name, resizedImageName, resizedImage).then(function(project){
                                            sendingCreateApiRequest = false;
                                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, project);
                                        }, function(errorId){
                                            //TODO
                                            sendingCreateApiRequest = false;
                                        });
                                        break;
                                    case 'folder':
                                        api.v1.treeNode.createFolder($scope.parentId, $scope.name).then(function(folder){
                                            sendingCreateApiRequest = false;
                                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, folder);
                                        }, function(errorId){
                                            //TODO
                                            sendingCreateApiRequest = false;
                                        });
                                        break;
                                    case 'document':
                                        break;
                                    case 'documentVersion':
                                        break;
                                }
                            }
                        };

                        $scope.cancelBtnClick = function(){
                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_CANCEL);
                        };
                    }]
                };
            });
    }
});