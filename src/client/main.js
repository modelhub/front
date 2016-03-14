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
                template: '<mh-logout class="mh-def mh-fill" ng-cloak></mh-logout>'
            })
            .when('/settings', {
                template: '<mh-settings class="mh-def mh-fill" ng-cloak></mh-settings>'
            })
            .when('/projects', {
                template: '<mh-projects class="mh-def mh-fill" ng-cloak></mh-projects>'
            })
            .when('/invites', {
                template: '<mh-invites class="mh-def mh-fill" ng-cloak></mh-invites>'
            })
            .when('/uploads', {
                template: '<mh-uploads class="mh-def mh-fill" ng-cloak></mh-uploads>'
            })
            .when('/aggregation', {
                template: ''
            })
            .when('/search/:project/:search', {
                template: '<mh-search class="mh-def mh-fill" ng-cloak></mh-search>'
            })
            .when('/folder/:folderId', {
                template: '<mh-folder-route class="mh-def mh-fill" ng-cloak></mh-folder-route>'
            })
            .otherwise({
                redirectTo: '/projects'
            });
    }]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});