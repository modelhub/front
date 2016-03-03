define('constant/event', [
], function(
){
    return function(ngModule){
        ngModule
            .constant('MH_EVENT', {
                LOAD_SHEET: 'LOAD_SHEET',
                UNLOAD_SHEET: 'UNLOAD_SHEET',
                SHOW_VIEWER: 'SHOW_VIEWER',
                HIDE_VIEWER: 'HIDE_VIEWER',
                SHOW_UPLOADS: 'SHOW_UPLOADS',
                HIDE_UPLOADS: 'HIDE_UPLOADS',
                FILE_UPLOAD_PROGRESS: 'FILE_UPLOAD_PROGRESS',
                FILE_UPLOAD_SUCCESS: 'FILE_UPLOAD_SUCCESS',
                FILE_UPLOAD_FAILURE: 'FILE_UPLOAD_FAILURE'
            });
    }
});