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
            .when('/logout', {
                template: '<mh-logout ng-cloak></mh-logout>'
            })
            .when('/settings', {
                template: '<mh-settings ng-cloak></mh-settings>'
            })
            .when('/projects', {
                template: '<mh-projects ng-cloak></mh-projects>'
            })
            .when('/invites', {
                template: '<mh-invites ng-cloak></mh-invites>'
            })
            .when('/uploads', {
                template: '<mh-uploads ng-cloak></mh-uploads>'
            })
            .when('/aggregation', {
                template: ''
            })
            .when('/search/:search', {
                template: '<mh-search ng-cloak></mh-search>'
            })
            .otherwise({
                redirectTo: '/projects'
            });
    }]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});