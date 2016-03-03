require([
    'ng',
    'registry'
], function(
    ng
){
    var app = ng.module('app', [
            'mh.registry'
        ]);

    ng.element(document).ready(function () {
        ng.bootstrap(document, ['app']);
    });
});