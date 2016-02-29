define('header/header', [
    'styler',
    'text!header/header.css',
    'text!header/header.html',
    'text!header/header.txt.json'
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
            .directive('cpHeader', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller:['$location', '$scope', 'currentUser', 'i18n', function($location, $scope, currentUser, i18n){
                        i18n($scope, txt);

                        currentUser.getInfo(function(user){
                            $scope.avatar = user.avatar;
                            $scope.fullName = user.fullName;
                        }, function(data){
                            //TODO
                        });

                        $scope.goToDocuments = function(){
                            $location.path('/documents');
                        };

                        $scope.goToSettings = function(){
                            $location.path('/settings');
                        };
                    }]
                };
            });
    }
});