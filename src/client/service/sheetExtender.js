define('service/sheetExtender', [
], function(
){
    return function(ngModule){
        ngModule
            .service('sheetExtender', ['three', function(three){
                // for use in projectSpace.js
                // it assumes:
                //  * sheet.model is a RenderModel
                //  * The RenderModel has fully loaded
                // DO NOT EXTEND A SHEET OBJECT if you can not guarantee all of the assumptions
                var THREE;
                three().then(function(threeLib){
                    THREE = threeLib;
                });

                return function(sheet){
                    sheet.extended = true;

                    sheet.getBoundingBox = function(objectIds){
                        //get bounding box for whole sheet if no objectIds specified
                        if(!objectIds){
                            objectIds = [1];
                        }

                        var bounds = new THREE.Box3();
                        var box = new THREE.Box3();

                        var instanceTree = sheet.model.getData().instanceTree;
                        var fragList = sheet.model.getFragmentList();

                        for (var i=0; i<objectIds.length; i++) {
                            instanceTree.enumNodeFragments(objectIds[i], function(fragId) {
                                fragList.getWorldBounds(fragId, box);
                                bounds.union(box);
                            }, true);
                        }

                        return bounds;
                    };
                };
            }]);
    };
});