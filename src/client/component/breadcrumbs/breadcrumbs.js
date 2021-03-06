define('breadcrumbs/breadcrumbs', [
    'styler',
    'text!breadcrumbs/breadcrumbs.css',
    'text!breadcrumbs/breadcrumbs.html',
    'text!breadcrumbs/breadcrumbs.txt.json'
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
            .directive('mhBreadcrumbs', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {
                        entityType: '@',
                        entityId: '@'
                    },
                    controller: ['$element', '$location', '$scope', '$window', 'api', 'i18n', function($element, $location, $scope, $window, api, i18n){
                        i18n($scope, txt);

                        $scope.rootParent = '00000000000000000000000000000000';

                        var rootEl = $element[0].getElementsByClassName('root')[0],
                            errorHandler = function(errorId){
                                $scope.errorId = errorId;
                            },
                            nodeGetters = function(leafNodeId) {
                                var leafNode;
                                api.v1.treeNode.get([leafNodeId]).then(function (entities) {
                                    leafNode = entities[0];
                                    api.v1.project.get([entities[0].project]).then(function (projects) {
                                        $scope.project = projects[0];
                                    }, errorHandler);

                                    api.v1.treeNode.getParents(leafNodeId).then(function (parents) {
                                        $scope.parents = parents;
                                        $scope.parents.push(leafNode);
                                        $window.setTimeout(function(){
                                            rootEl.scrollLeft = rootEl.scrollWidth;
                                        }, 0);
                                    }, errorHandler);
                                }, errorHandler);
                            },
                            versionGetter = function(versionId, type){
                                var fn = api.v1.documentVersion.get;
                                if(type === 'projectSpaceVersion') fn = api.v1.projectSpaceVersion.get;
                                fn([versionId]).then(function(entities){
                                    $scope.versionEntity = entities[0];
                                    if(type === 'documentVersion'){
                                        nodeGetters(entities[0].document);
                                    }
                                    if(type === 'projectSpaceVersion'){
                                        nodeGetters(entities[0].projectSpace);
                                    }
                                }, errorHandler);
                            },
                            sheetGetter = function(sheetId){
                                api.v1.sheet.get([$scope.entityId]).then(function(sheets){
                                    $scope.sheetEntity = sheets[0];
                                    versionGetter(sheets[0].documentVersion, 'documentVersion');
                                }, errorHandler);
                            };

                        switch ($scope.entityType) {
                            case 'folder':
                            case 'document':
                            case 'projectSpace':
                                nodeGetters($scope.entityId);
                                break;
                            case 'documentVersion':
                            case 'projectSpaceVersion':
                                versionGetter($scope.entityId, $scope.entityType);
                                break;
                            case 'sheet':
                                sheetGetter($scope.entityId);
                                break;
                            default:
                                throw 'unknown entity type';
                        }

                        $scope.treeNodeClick = function(node){
                            $location.path('/'+node.nodeType+'/'+node.id);
                        };

                        $scope.versionEntityClick = function(){
                            if($scope.entityType === 'projectSpaceVersion'){
                                $location.path('/projectSpaceVersion/'+$scope.versionEntity.id);
                            } else if($scope.entityType === 'documentVersion' || $scope.entityType === 'sheet'){
                                $location.path('/documentVersion/'+$scope.versionEntity.id);
                            }
                        };

                        $scope.sheetEntityClick = function(){
                            $location.path('/sheet/'+$scope.sheetEntity.id);
                        };
                    }]
                };
            });
    }
});