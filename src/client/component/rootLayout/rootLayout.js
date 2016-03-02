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
                    controller: ['api', function(api) {

                        var currentUser;

                        api.v1.user.getCurrent().then(function(cu){
                            currentUser = cu;
                            console.log(currentUser)
                        },function(err){
                            console.log(err)
                        }).then(function(){

                            api.v1.user.setProperty("uiTheme", "light").then(function(data){
                                console.log(data)
                            },function(err){
                                console.log(err)
                            });

                            api.v1.user.setProperty("description", "Đāŋiĕł yo ho ho "+ Date.now()).then(function(data){
                                console.log(data)
                            },function(err){
                                console.log(err)
                            }).then(function(){
                                api.v1.user.getDescription(currentUser.id).then(function(data){
                                    console.log(data)
                                },function(err){
                                    console.log(err)
                                })
                            }, function(err){});

                            api.v1.user.get([currentUser.id]).then(function(users){
                                console.log(users)
                            },function(err){
                                console.log(err)
                            });

                            api.v1.user.search("Đāŋiĕł", 0, 5, "fullNameAsc").then(function(result){
                                console.log(result)
                            },function(err){
                                console.log(err)
                            });

                        });
                    }]
                };
            });
    }
});