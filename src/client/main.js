require([
    'ng',
    'ngRoute',
    'registry'
], function(
    ng
){
    var app = ng.module('app', [
            'ngRoute',
            'cp.registry'
        ]);
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/documents', {
                template: '<cp-documents class="cp-def cp-row cp-fill" ng-cloak></cp-documents>'
            })
            .when('/settings', {
                template: '<cp-settings class="cp-def cp-row cp-fill" ng-cloak></cp-settings>'
            })
            .when('/modal', {
                template: '<test-docs ng-cloak></test-docs>'
            })
            .otherwise({
                redirectTo: '/documents'
            });
    }]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});