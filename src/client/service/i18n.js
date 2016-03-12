define('service/i18n', [
    'moment',
    'momentLocale/de'
], function(
    moment
){
    return function(ngModule){
        ngModule
            .service('i18n', ['$rootScope', 'currentUser', 'EVENT', function($rootScope, currentUser, EVENT){

                var lang = currentUser().uiLanguage,
                    shortLang = lang.substring(0, 2),
                    timeFormat = currentUser().timeFormat,
                    service;

                moment.locale(lang);

                service = function(scope, i18nTxt){

                    if(typeof i18nTxt === 'string'){
                        i18nTxt = JSON.parse(i18nTxt);
                    }

                    scope.txt = function(){
                        var strId = arguments[0];
                        var txt = i18nTxt[strId][shortLang];
                        var argsLen = arguments.length;
                        for(var i = 1; i < argsLen; i++){
                            txt = txt.replace('{'+(i-1)+'}', arguments[i]);
                        }
                        return txt;
                    };

                    scope.dt = function(date, format){
                        date = date.replace('T', ' ');
                        if (!format) {
                            format = timeFormat;
                        }
                        return moment(date).format(format);
                    };

                };

                return service;
            }]);
    }
});
