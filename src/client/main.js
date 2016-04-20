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
            .when('/search/:project/:search', {
                template: '<mh-search-route class="mh-def mh-fill" ng-cloak></mh-search-route>'
            })
            .when('/folder/:folderId', {
                template: '<mh-folder-route class="mh-def mh-fill" ng-cloak></mh-folder-route>'
            })
            .when('/document/:documentId', {
                template: '<mh-document-route class="mh-def mh-fill" ng-cloak></mh-document-route>'
            })
            .when('/projectSpace/:projectSpaceId', {
                template: '<mh-project-space-route class="mh-def mh-fill" ng-cloak></mh-project-space-route>'
            })
            .when('/documentVersion/:documentVersionId', {
                template: '<mh-document-version-route class="mh-def mh-fill" ng-cloak></mh-document-version-route>'
            })
            .when('/projectSpaceVersion/:projectSpaceVersionId', {
                template: '<mh-project-space-version-route class="mh-def mh-fill" ng-cloak></mh-project-space-version-route>'
            })
            .when('/sheet/:sheetId', {
                template: '<mh-sheet-route class="mh-def mh-fill" ng-cloak></mh-sheet-route>'
            })
            .when('/projectSpaceViewer/:projectId', {
                template: '<!--rootlayout will show the projectSpaceViewer-->'
            })
            .otherwise({
                redirectTo: '/projects'
            });
    }]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});