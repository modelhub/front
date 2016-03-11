require([
    'ng',
    'ngRoute',
    'registry'
], function(
    ng
){
    var app = ng.module('app', [
            'ngRoute',
            'mh.registry'
        ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/documents', {
                template: '<mh-user-route class="mh-def" ng-cloak></mh-user-route>'
            })
            .otherwise({
                redirectTo: '/documents'
            });
    }]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});