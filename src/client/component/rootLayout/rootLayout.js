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

                        var currentUser,
                            ashId = "11e5e12835c755b9a5ae3417ebd83aea", //these ids are specifc to the modelhub db instances
                            bobId = "11e5e12845708411a5ae3417ebd83aea",
                            catId = "11e5e12890f1ade8a5ae3417ebd83aea";

                        api.v1.user.getCurrent().then(function(cu){
                            currentUser = cu;
                            console.log("api.v1.user.getCurrent: ", currentUser);
                        },function(err){
                            console.log("api.v1.user.getCurrent: ", err);
                        }).then(function(){

                            api.v1.user.setProperty("description", "Đāŋ ®ðǷ yo ho ho "+ Date.now()).then(function(data){
                                console.log("api.v1.user.setProperty: ", data);
                            },function(err){
                                console.log("api.v1.user.setProperty: ", err);
                            }).then(function(){
                                api.v1.user.getDescription(currentUser.id).then(function(data){
                                    console.log("api.v1.user.getDescription: ", data);
                                },function(err){
                                    console.log("api.v1.user.getDescription: ", err);
                                })
                            });

                            api.v1.user.get([ashId, bobId, catId]).then(function(users){
                                console.log("api.v1.user.get: ", users);
                            }, function(err){
                                console.log("api.v1.user.get: ", err);
                            });

                            api.v1.user.search("autodesk", 0, 2, "fullNameDesc").then(function(result){
                                console.log("api.v1.user.search: ", result);
                            },function(err){
                                console.log("api.v1.user.search: ", err);
                            });

                        });

                        var project;

                        api.v1.project.create("my new project", "just for testing", null).then(function(p){
                            project = p;
                            console.log("api.v1.project.create: ", project);
                        },function(err){
                            console.log("api.v1.project.create: ", err);
                        }).then(function(){

                            api.v1.project.setName(project.id, "my project name EDITED "+Date.now()).then(function(data){
                                console.log("api.v1.project.setName: ", data);
                            },function(err){
                                console.log("api.v1.project.setName: ", err);
                            });

                            api.v1.project.setDescription(project.id, "just for testing EDITED "+Date.now()).then(function(data){
                                console.log("api.v1.project.setDescription: ", data);
                            },function(err){
                                console.log("api.v1.project.setDescription: ", err);
                            });

                            api.v1.project.setImage(project.id, null).then(function(data){
                                console.log("api.v1.project.setImage: ", data);
                            },function(err){
                                console.log("api.v1.project.setImage: ", err);
                            });

                            api.v1.project.addUsers(project.id, "admin", [ashId, bobId, catId]).then(function(data){
                                console.log("api.v1.project.addUsers: ", data);
                            },function(err){
                                console.log("api.v1.project.addUsers: ", err);
                            }).then(function(){

                                api.v1.project.getMemberships(project.id, "any", 0, 5, "fullNameAsc").then(function(results){
                                    console.log("api.v1.project.getMemberships: ", results);
                                }, function(err){
                                    console.log("api.v1.project.getMemberships: ", err);
                                });

                                api.v1.project.getMembershipInvites(project.id, "any", 0, 5, "fullNameAsc").then(function(results){
                                    console.log("api.v1.project.getMembershipInvites: ", results);
                                }, function(err){
                                    console.log("api.v1.project.getMembershipInvites: ", err);
                                }).then(function(){

                                    api.v1.project.removeUsers(project.id, [bobId, catId]).then(function(data){
                                        console.log("api.v1.project.removeUsers: ", data);
                                    }, function(err){
                                        console.log("api.v1.project.removeUsers: ", err);
                                    }).then(function(){

                                        api.v1.project.getMemberships(project.id, "any", 0, 5, "fullNameAsc").then(function(results){
                                            console.log("api.v1.project.getMemberships: ", results);
                                        }, function(err){
                                            console.log("api.v1.project.getMemberships: ", err);
                                        });

                                        api.v1.project.getMembershipInvites(project.id, "any", 0, 5, "fullNameAsc").then(function(results){
                                            console.log("api.v1.project.getMembershipInvites: ", results);
                                        }, function(err){
                                            console.log("api.v1.project.getMembershipInvites: ", err);
                                        });

                                        api.v1.project.getInUserInviteContext(ashId, "any", 0, 5, "nameAsc").then(function(results){
                                            console.log("api.v1.project.getInUserInviteContext: ", results);
                                        }, function(err){
                                            console.log("api.v1.project.getInUserInviteContext: ", err);
                                        });

                                    });

                                });

                            });

                            api.v1.project.getInUserContext(currentUser.id, "any", 0, 5, "nameAsc").then(function(results){
                                console.log("api.v1.project.getInUserContext: ", results);
                            }, function(err){
                                console.log("api.v1.project.getInUserContext: ", err);
                            });

                            api.v1.project.get([project.id]).then(function(data){
                                console.log("api.v1.project.get: ", data);
                            }, function(err){
                                console.log("api.v1.project.get: ", err);
                            });

                            var folder1;

                            api.v1.treeNode.createFolder(project.id, "my test folder 1").then(function(data){
                                folder1 = data;
                                console.log("api.v1.treeNode.createFolder: ", data);
                            }, function(err){
                                console.log("api.v1.treeNode.createFolder: ", err);
                            }).then(function(){

                                var folder2;

                                api.v1.treeNode.createFolder(project.id, "my test folder 2").then(function(data){
                                    folder2 = data;
                                    console.log("api.v1.treeNode.createFolder: ", data);
                                }, function(err){
                                    console.log("api.v1.treeNode.createFolder: ", err);
                                }).then(function(){

                                    api.v1.treeNode.get([folder1.id, folder2.id]).then(function(data){
                                        console.log("api.v1.treeNode.get: ", data);
                                    }, function(err){
                                        console.log("api.v1.treeNode.get: ", err);
                                    });

                                    api.v1.treeNode.getChildren(project.id, "any", 0, 5, "nameAsc").then(function(data){
                                        console.log("api.v1.treeNode.getChildren: ", data);
                                    }, function(err){
                                        console.log("api.v1.treeNode.getChildren: ", err);
                                    }).then(function(){

                                        api.v1.treeNode.move(folder1.id, [folder2.id]).then(function(data){
                                            console.log("api.v1.treeNode.move: ", data);
                                        }, function(err){
                                            console.log("api.v1.treeNode.move: ", err);
                                        }).then(function(){

                                            api.v1.treeNode.getParents(folder2.id).then(function(data){
                                                console.log("api.v1.treeNode.getParents: ", data);
                                            }, function(err){
                                                console.log("api.v1.treeNode.getParents: ", err);
                                            });

                                            api.v1.treeNode.globalSearch("test", "any", 0, 5, "nameAsc").then(function(data){
                                                console.log("api.v1.treeNode.globalSearch: ", data);
                                            }, function(err){
                                                console.log("api.v1.treeNode.globalSearch: ", err);
                                            });

                                            api.v1.treeNode.projectSearch(project.id, "test", "any", 0, 5, "nameAsc").then(function(data){
                                                console.log("api.v1.treeNode.projectSearch: ", data);
                                            }, function(err){
                                                console.log("api.v1.treeNode.projectSearch: ", err);
                                            });

                                        });

                                    });

                                });

                            });

                            api.v1.treeNode.createDocument(project.id, "my test doc", "test upload comment", null).then(function(data){
                                console.log("api.v1.treeNode.createDocument: ", data);
                            }, function(err){
                                console.log("api.v1.treeNode.createDocument: ", err);
                            });

                        });
                    }]
                };
            });
    }
});