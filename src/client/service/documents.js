define('service/documents', [
], function(
){
    return function(ngModule){
        ngModule
            .service('documents', ['$http', function($http){
                return {
                    getAll: function(success, error){
                        $http
                            .get('/api/v1/getAllDocumentsAndVersions')
                            .success(success)
                            .error(error);
                    },
                    upload: function(file, success, error){
                        var data = new FormData();
                        data.append('file', file, file.name);
                        $http
                            .post('/api/v1/uploadDocumentVersion', data, {
                                headers: {'Content-Type': undefined },
                                transformRequest: angular.identity
                            })
                            .success(success)
                            .error(error);
                    }
                };
            }]);
    }
});
