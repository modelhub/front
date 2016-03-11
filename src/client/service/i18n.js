define('service/i18n', [
    'moment'
], function(
    moment
){
    return function(ngModule){
        ngModule
            .service('i18n', ['$rootScope', 'currentUser', 'EVENT', function($rootScope, currentUser, EVENT){

                var lastLang = currentUser().uiLanguage,
                    lastMomentLocale = currentUser().locale,
                    lastTimeFormat = currentUser().timeFormat,
                    service;

                service = function(scope, i18nTxt){

                    if(typeof i18nTxt === 'string'){
                        i18nTxt = JSON.parse(i18nTxt);
                    }

                    var langChangeHandler = function(event, lang){
                        var idx = i18nTxt.langs.indexOf(lang);
                        idx = idx === -1? 0: idx;
                        scope.lang = scope.lang != i18nTxt.langs[idx]? i18nTxt.langs[idx]: scope.lang;
                    };

                    langChangeHandler(null, lastLang);

                    scope.$on(EVENT.LANGUAGE_CHANGE, langChangeHandler);

                    scope.txt = function(){
                        var strId = arguments[0];
                        var txt = i18nTxt[strId][scope.lang];
                        var argsLen = arguments.length;
                        for(var i = 1; i < argsLen; i++){
                            txt = txt.replace('{'+(i-1)+'}', arguments[i]);
                        }
                        return txt;
                    };

                    scope.dt = function(date, format){
                        date = date.replace('T', ' ');
                        if (!format) {
                            format = lastTimeFormat;
                        }
                        return moment(date).format(format);
                    };

                };

                service.setLang = function(lang){

                    if(lastMomentLocale != lang){
                        lastMomentLocale = moment.locale(lang);
                    }

                    if(typeof lang === 'string' && lang.length > 2){
                        lang = lang.substring(0, 2);
                    }

                    lastLang = lang;
                    $rootScope.$broadcast(EVENT.LANGUAGE_CHANGE, lang);

                };

                return service;
            }]);
    }
});
