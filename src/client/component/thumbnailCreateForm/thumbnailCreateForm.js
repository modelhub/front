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
                    controller: ['$element', '$rootScope', '$scope', 'api', 'EVENT', 'i18n', 'thumbnail', 'upload', function($element, $rootScope, $scope, api, EVENT, i18n, thumbnail, uploads){
                        i18n($scope, txt);

                        if($scope.newType === 'project'){
                            $scope.fileInputAccept = 'image/*';
                        } else {
                            $scope.fileInputAccept = '*/*';
                        }

                        var fileEl = $element[0].getElementsByClassName('file-input')[0];

                        function resetForm(){
                            fileEl.value = '';
                            $scope.imgSrc = '';
                            $scope.name = '';
                            $scope.multiFiles = false;
                            $scope.singleFile = false;
                            $scope.fileExtension = '';
                        }

                        resetForm();

                        $scope.$on(EVENT.SHOW_THUMBNAIL_CREATE_FORM, resetForm);

                        $scope.$on(EVENT.HIDE_THUMBNAIL_CREATE_FORM, resetForm);

                        $scope.newFileInputBtnClick = function(){
                            if (!processingThumbnail && $scope.newType !== 'folder') {
                                fileEl.click();
                            }
                        };

                        $scope.nameInputKeyPress = function(e){
                            if(e.keyCode == 13) { //enter
                                $scope.createBtnClick();
                            }
                        };

                        var processingThumbnail = false,
                            resizedImage = null,
                            resizedImageType = null;
                        $scope.newFileInputChange = function(){
                            if (!processingThumbnail) {
                                if (fileEl.files.length === 1 || ($scope.newType === 'project' && fileEl.files.length >= 1)) {
                                    $scope.singleFile = true;
                                    $scope.multiFiles = false;
                                    processingThumbnail = true;
                                    thumbnail(fileEl.files[0], 196).then(function (data) {
                                        resizedImage = data.blob;
                                        resizedImageType = data.type;
                                        if (data.image) {
                                            $scope.imgSrc = data.image.src;
                                        } else {
                                            $scope.imgSrc = '';
                                        }
                                        processingThumbnail = false;
                                    }, function (error) {
                                        processingThumbnail = false;
                                        $scope.imgSrc = '';
                                        fileEl.value= '';
                                    });
                                    if ($scope.newType !== 'project') {
                                        var lastIdxOfDot = fileEl.files[0].name.lastIndexOf('.');
                                        if (lastIdxOfDot !== -1) {
                                            $scope.fileExtension = fileEl.files[0].name.substring(lastIdxOfDot + 1);
                                        }
                                        if (lastIdxOfDot !== -1) {
                                            $scope.name = fileEl.files[0].name.substring(0, lastIdxOfDot)
                                        } else {
                                            $scope.name = fileEl.files[0].name;
                                        }
                                    }
                                } else if (fileEl.files.length > 1){
                                    $scope.singleFile = false;
                                    $scope.imgSrc = '';
                                    $scope.multiFiles = true;
                                    $scope.fileExtension = '';
                                    $scope.name = '';
                                    $scope.$evalAsync();
                                } else {
                                    resetForm();
                                    $scope.$evalAsync();
                                }
                            }
                        };

                        $scope.sendingCreateApiRequest = false;
                        $scope.createBtnClick = function(){
                            if(!$scope.sendingCreateApiRequest && !processingThumbnail){
                                $scope.sendingCreateApiRequest = true;
                                $scope.name = $scope.name.trim();
                                switch($scope.newType){
                                    case 'project':
                                        api.v1.project.create($scope.name, resizedImageType, resizedImage).then(function(project){
                                            $scope.sendingCreateApiRequest = false;
                                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, project);
                                        }, function(errorId){
                                            //TODO
                                            $scope.sendingCreateApiRequest = false;
                                        });
                                        break;
                                    case 'folder':
                                        api.v1.treeNode.createFolder($scope.parentId, $scope.name).then(function(folder){
                                            $scope.sendingCreateApiRequest = false;
                                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, folder);
                                        }, function(errorId){
                                            //TODO
                                            $scope.sendingCreateApiRequest = false;
                                        });
                                        break;
                                    case 'document':
                                        api.v1.treeNode.createDocument($scope.parentId, $scope.name).then(function(document){
                                            $scope.sendingCreateApiRequest = false;
                                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, document);
                                        }, function(errorId){
                                            //TODO
                                            $scope.sendingCreateApiRequest = false;
                                        });
                                        break;
                                    case 'documentVersion':
                                        api.v1.documentVersion.create($scope.parentId, $scope.name).then(function(document){
                                            $scope.sendingCreateApiRequest = false;
                                            $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS, document);
                                        }, function(errorId){
                                            //TODO
                                            $scope.sendingCreateApiRequest = false;
                                        });
                                        break;
                                }
                            }
                        };

                        $scope.cancelBtnClick = function() {
                            if (!$scope.sendingCreateApiRequest && !processingThumbnail) {
                                $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_CANCEL);
                            }
                        };
                    }]
                };
            });
    }
});