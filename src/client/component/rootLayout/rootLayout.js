define('rootLayout/rootLayout', [
    'styler',
    'text!rootLayout/rootLayout.css',
    'text!rootLayout/rootLayout.html'
], function(
    styler,
    style,
    tpl
){
    styler(style);

    return function(ngModule){
        ngModule
            .directive('mhRootLayout', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['modelhub', function(modelhub) {

                        modelhub.user.getCurrent(function(currentUser){
                            console.log(currentUser)
                        },function(err){
                            console.log(err)
                        });

                        modelhub.user.setProperty("uiTheme", "light", function(data){
                            console.log(data)
                        },function(err){
                            console.log(err)
                        });

                        modelhub.user.get(["11e5dff27e92b949a8d100ffb04b82ac"], function(currentUser){
                            console.log(currentUser)
                        },function(err){
                            console.log(err)
                        });
                    }]
                };
            });
    }
});