define('aggregationViewer/aggregationViewer', [
    'styler',
    'text!aggregationViewer/aggregationViewer.css',
    'text!aggregationViewer/aggregationViewer.html',
    'text!aggregationViewer/aggregationViewer.txt.json'
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
            .directive('mhAggregationViewer', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: [ function(){
                    }]
                };
            });
    }
});