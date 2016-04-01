define('constant/event', [
], function(
){
    return function(ngModule){
        ngModule
            .constant('EVENT', {
                SHOW_MAIN_MENU: 'SHOW_MAIN_MENU',
                HIDE_MAIN_MENU: 'HIDE_MAIN_MENU',
                SHOW_CREATE_FORM: 'SHOW_CREATE_FORM',
                HIDE_CREATE_FORM: 'HIDE_CREATE_FORM',
                CREATE_FORM_CANCEL: 'CREATE_FORM_CANCEL',
                CREATE_FORM_SUCCESS: 'CREATE_FORM_SUCCESS',
                LOAD_SHEET_INTO_AGGREGATION_VIEWER: 'LOAD_SHEET_INTO_AGGREGATION_VIEWER',
                UNLOAD_SHEET_FROM_AGGREGATION_VIEWER: 'UNLOAD_SHEET_FROM_AGGREGATION_VIEWER',
                UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
                UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
                UPLOAD_ERROR: 'UPLOAD_ERROR',
                UPLOAD_REQUEST_SUCCESS: 'UPLOAD_REQUEST_SUCCESS',
                UPLOAD_REQUEST_ERROR: 'UPLOAD_REQUEST_ERROR',
                UPLOADS_COUNT_CHANGE: 'UPLOADS_COUNT_CHANGE',
                UPLOADS_CHANGED: 'UPLOADS_CHANGED',
                VIEWER_READY: 'VIEWER_READY'
            });
    }
});