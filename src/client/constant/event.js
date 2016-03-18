define('constant/event', [
], function(
){
    return function(ngModule){
        ngModule
            .constant('EVENT', {
                SHOW_MAIN_MENU: 'SHOW_MAIN_MENU',
                HIDE_MAIN_MENU: 'HIDE_MAIN_MENU',
                SHOW_THUMBNAIL_CREATE_FORM: 'SHOW_THUMBNAIL_CREATE_FORM',
                HIDE_THUMBNAIL_CREATE_FORM: 'HIDE_THUMBNAIL_CREATE_FORM',
                THUMBNAIL_CREATE_FORM_CANCEL: 'THUMBNAIL_CREATE_FORM_CANCEL',
                THUMBNAIL_CREATE_FORM_SUCCESS: 'THUMBNAIL_CREATE_FORM_SUCCESS',
                LOAD_SHEET_INTO_AGGREGATION_VIEWER: 'LOAD_SHEET_INTO_AGGREGATION_VIEWER',
                UNLOAD_SHEET_FROM_AGGREGATION_VIEWER: 'UNLOAD_SHEET_FROM_AGGREGATION_VIEWER',
                UPLOAD_START: 'UPLOAD_START',
                UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
                UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
                UPLOAD_ERROR: 'UPLOAD_ERROR',
                UPLOAD_REQUEST_SUCCESS: 'UPLOAD_REQUEST_SUCCESS',
                UPLOAD_REQUEST_ERROR: 'UPLOAD_REQUEST_ERROR',
                UPLOADS_CLEARED: 'UPLOADS_CLEARED'
            });
    }
});