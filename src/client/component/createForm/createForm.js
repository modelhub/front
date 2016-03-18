define('createForm/createForm', [
    'styler',
    'text!createForm/createForm.css',
    'text!createForm/createForm.html',
    'text!createForm/createForm.txt.json'
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
            .directive('mhCreateForm', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        newType: '@',
                        parentId: '@'
                    },
                    controller: ['$element', '$rootScope', '$scope', 'api', 'EVENT', 'i18n', 'thumbnail', 'uploader', function($element, $rootScope, $scope, api, EVENT, i18n, thumbnail, uploader){
                        i18n($scope, txt);

                        if($scope.newType === 'project'){
                            $scope.fileInputAccept = 'image/*';
                        } else {
                            $scope.fileInputAccept = '*/*';
                        }

                        var multiFilesEl = $element[0].getElementsByClassName('multi-files')[0],
                            singleFileEl = $element[0].getElementsByClassName('single-file')[0];

                        function currentFileEl(){
                            if($scope.newType === 'document'){
                                return multiFilesEl;
                            } else {
                                return singleFileEl;
                            }
                        }

                        function resetForm(){
                            multiFilesEl.value = '';
                            singleFileEl.value = '';
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
                                currentFileEl().click();
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
                                if (currentFileEl().files.length === 1 || ($scope.newType === 'project' && currentFileEl().files.length >= 1)) {
                                    $scope.singleFile = true;
                                    $scope.multiFiles = false;
                                    processingThumbnail = true;
                                    thumbnail(currentFileEl().files[0], 196).then(function (data) {
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
                                    });
                                    if ($scope.newType !== 'project') {
                                        var lastIdxOfDot = currentFileEl().files[0].name.lastIndexOf('.');
                                        $scope.name = currentFileEl().files[0].name;
                                        if (lastIdxOfDot !== -1) {
                                            $scope.fileExtension = currentFileEl().files[0].name.substring(lastIdxOfDot + 1);
                                            $scope.name = currentFileEl().files[0].name.substring(0, lastIdxOfDot)
                                        }
                                    }
                                } else if (currentFileEl().files.length > 1){
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
                                        var files = multiFilesEl.files;
                                        for(var i = 0, l = files.length; i < l; i++){
                                            if(l === 1){
                                                uploader.start('document', $scope.parentId, $scope.name, files[i]);
                                            } else {
                                                var lastIdxOfDot = files[i].name.lastIndexOf('.');
                                                var name = files[i].name;
                                                if (lastIdxOfDot !== -1) {
                                                    name = files[i].name.substring(0, lastIdxOfDot)
                                                }
                                                uploader.start('document', $scope.parentId, name, files[i]);
                                            }
                                        }
                                        $scope.sendingCreateApiRequest = false;
                                        $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS);
                                        break;
                                    case 'documentVersion':
                                        if(singleFileEl.files.length === 1) {
                                            uploader.start('documentVersion', $scope.parentId, singleFileEl.files[0].name, singleFileEl.files[0]);
                                        }
                                        $scope.sendingCreateApiRequest = false;
                                        $rootScope.$broadcast(EVENT.THUMBNAIL_CREATE_FORM_SUCCESS);
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