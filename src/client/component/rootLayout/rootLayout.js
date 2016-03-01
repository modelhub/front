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

                        var currentUser;

                        modelhub.user.getCurrent().then(function(cu){
                            currentUser = cu;
                            console.log(currentUser)
                        },function(err){
                            console.log(err)
                        }).then(function(){

                            modelhub.user.setProperty("uiTheme", "light").then(function(data){
                                console.log(data)
                            },function(err){
                                console.log(err)
                            });

                            modelhub.user.get([currentUser.id]).then(function(users){
                                console.log(users)
                            },function(err){
                                console.log(err)
                            });

                        });
                    }]
                };
            });
    }
});