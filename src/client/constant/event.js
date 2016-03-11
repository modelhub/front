define('constant/event', [
], function(
){
    return function(ngModule){
        ngModule
            .constant('EVENT', {
                SHOW_MAIN_MENU: 'SHOW_MAIN_MENU',
                HIDE_MAIN_MENU: 'HIDE_MAIN_MENU',
                SHOW_AGGREGATION_VIEWER: 'SHOW_AGGREGATION_VIEWER',
                HIDE_AGGREGATION_VIEWER: 'HIDE_AGGREGATION_VIEWER',
                LOAD_SHEET_INTO_AGGREGATION_VIEWER: 'LOAD_SHEET_INTO_AGGREGATION_VIEWER',
                UNLOAD_SHEET_FROM_AGGREGATION_VIEWER: 'UNLOAD_SHEET_FROM_AGGREGATION_VIEWER',
                FILE_UPLOAD_PROGRESS: 'FILE_UPLOAD_PROGRESS',
                FILE_UPLOAD_SUCCESS: 'FILE_UPLOAD_SUCCESS',
                FILE_UPLOAD_FAILURE: 'FILE_UPLOAD_FAILURE',
                LANGUAGE_CHANGE: 'LANGUAGE_CHANGE'
            });
    }
});