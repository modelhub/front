define('documents/documents', [
    'styler',
    'text!documents/documents.css',
    'text!documents/documents.html',
    'text!documents/documents.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    var documentsInputIdSrc = 0;
    return function(ngModule){
        ngModule
            .directive('cpDocuments', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller:['$rootScope', '$scope', '$window', 'i18n', 'documents',
                            function($rootScope, $scope, $window, i18n, documents){
                        i18n($scope, txt);
                        $scope.documentInputId = 'documents-input-id-'+documentsInputIdSrc;
                        $scope.uploadTimer = null;

                        $scope.startUploadTimer = function(){
                            if ($scope.uploadTimer !== null){
                                return;
                            }
                            $scope.uploadTimer = $window.setInterval($scope.refreshDocuments, 3000);
                        };

                        $scope.stopUploadTimer = function(){
                            if ($scope.uploadTimer !== null){
                                $window.clearInterval($scope.uploadTimer);
                                $scope.uploadTimer = null;
                            }
                        };

                        $scope.refreshDocuments = function(){
                            // start the timer (do this here, rather than in uploadDocumentImpl because we might have
                            // pending uploads at the point the app is loaded)
                            $scope.startUploadTimer();

                            documents.getAll(function(data){
                                $scope.data = data;
                                if ($scope.uploadTimer !== null){
                                    var stopTimer = true;
                                    for (var doc in $scope.data){
                                        if ($scope.data[doc].versions[0].objectInfo.status.indexOf('pending') != -1 ||
                                            $scope.data[doc].versions[0].objectInfo.status.indexOf('inprogress') != -1){
                                            stopTimer = false;
                                            break;
                                        }
                                    }
                                    if (stopTimer){
                                        $scope.stopUploadTimer();
                                    }
                                }
                            }, function(){
                                //TODO
                            });
                        };

                        $scope.selectDocument = function(){
                            var fileInput = document.getElementById($scope.documentInputId);
                            fileInput.files = [];
                            fileInput.click();
                        };

                        $scope.uploadDocumentImpl = function(){
                            var fileInput = document.getElementById($scope.documentInputId);
                            if (fileInput.files[0] !== null){
                                documents.upload(fileInput.files[0], function(){
                                    $scope.refreshDocuments();
                                 }, function(){
                                    //TODO
                                });
                            }
                        };

                        $scope.refreshDocuments();
                    }]
                };
            });
    }
});