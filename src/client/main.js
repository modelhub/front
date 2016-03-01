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
                template: '<mh-documents class="mh-def mh-row mh-fill" ng-cloak></mh-documents>'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});