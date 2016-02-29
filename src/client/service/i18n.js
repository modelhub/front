define('service/i18n', [
    'moment'
], function(
    moment
){
    return function(ngModule){
        ngModule
            .service('i18n', ['$rootScope', function($rootScope){

                var lang_change_event = 'i18n_lang_change_event',
                    last_lang,
                    last_moment_locale,
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

                    langChangeHandler(null, last_lang);

                    scope.$on(lang_change_event, langChangeHandler);

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
                        return moment(date).format(format);
                    };

                };

                service.setLang = function(lang){

                    if(last_moment_locale != lang){
                        last_moment_locale = moment.locale(lang);
                    }

                    if(typeof lang === 'string' && lang.length > 2){
                        lang = lang.substring(0, 2);
                    }

                    last_lang = lang;
                    $rootScope.$broadcast(lang_change_event, lang);

                };

                var prefLang = window.navigator.languages ? window.navigator.languages[0] : null;
                prefLang = prefLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

                service.setLang(prefLang);

                return service;
            }]);
    }
});
