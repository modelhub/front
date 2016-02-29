define('service/sheetExtractor', [
], function(
){
    return function(ngModule){
        ngModule
            .service('sheetExtractor', [function(){
                function getSubItemsWithProperties(item, properties, recursive){
                    var subItems = [];
                    if(!item) return [];

                    function hasProperties(item){
                        for(var p in properties){
                            if (!(p in item) || (properties[p] !== item[p]))
                                return false;
                        }
                        return true;
                    }

                    var len = item.children ? item.children.length : 0;
                    for(var i=0; i < len; i++){
                        // Check if this child has this key and value.
                        //
                        var child = item.children[i];
                        if(hasProperties(child)){
                            subItems.push(child);
                        }

                        // Search the descendants if requested.
                        //
                        if(recursive){
                            subItems.push.apply(subItems, getSubItemsWithProperties(child, properties, recursive));
                        }
                    }
                    return subItems;
                }

                function getSheetFetchData(item, isLeaflet) {
                    var items = [];
                    if (item.type === 'geometry') {
                        if (item.role === '3d') {
                            items = getSubItemsWithProperties(item, {
                                'mime': 'application/autodesk-svf'
                            }, false);
                        } else if (item.role === '2d' && isLeaflet) {
                            items = getSubItemsWithProperties(item, {
                                'type': 'resource',
                                'role': "leaflet"
                            }, false);
                        } else { //must be f2d
                            items = getSubItemsWithProperties(item, {
                                'mime': 'application/autodesk-f2d'
                            }, false);
                        }

                        return items[0];
                    }
                }

                return {
                    getSheets: function(doc) {
                        var svfItems = getSubItemsWithProperties(doc, {type: 'geometry', role: '3d'}, true);
                        var twoDimGeoms = getSubItemsWithProperties(doc, {type: 'geometry', role: '2d'}, true);

                        var f2dItems = [];
                        twoDimGeoms.forEach(function(item){
                            var subItems = getSubItemsWithProperties(item, {
                                'mime': 'application/autodesk-f2d'
                            }, false);
                            if(subItems.length > 0){
                                f2dItems.push(item);
                            }
                        });

                        var leafletItems = [];
                        twoDimGeoms.forEach(function(item){
                            var subItems = getSubItemsWithProperties(item, {
                                'type': 'resource',
                                'role': "leaflet"
                            }, false);
                            if(subItems.length > 0){
                                leafletItems.push(item);
                            }
                        });

                        return {
                            svf: svfItems,
                            f2d: f2dItems,
                            leaflet: leafletItems
                        };
                    },
                    getSheetFetchData: getSheetFetchData
                };
            }]);
    }
});