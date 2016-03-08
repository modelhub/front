define('user/user', [
    'styler',
    'text!user/user.css',
    'text!user/user.html',
    'text!user/user.txt.json'
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
            .directive('mhUser', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        userId: '@'
                    },
                    controller: ['$scope', 'api', 'currentUser', 'i18n', 'logout', function($scope, api, currentUser, i18n, logout){

                        i18n($scope, txt);

                        $scope.myId = currentUser().id;

                        $scope.status = 'init';

                        $scope.logout = logout;

                        api.v1.user.get([$scope.userId]).then(function (users) {
                            if (users.length === 0) {
                                $scope.status = 'noSuchUser';
                            } else {
                                $scope.status = 'ready';
                                $scope.user = users[0];
                            }
                        }, function (errorId) {
                            $scope.status = 'error';
                            $scope.errorId = errorId;
                        });

                        api.v1.user.getDescription($scope.userId).then(function(description){
                            $scope.user.description = description;
                        },function(errorId){
                            $scope.descriptionErrorId = errorId;
                        })
                    }]
                };
            });
    }
});