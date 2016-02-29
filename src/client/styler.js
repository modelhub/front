define('styler', [
    'text!topLevelCss'
], function(
    topLevelCss
){
    var el = document.createElement('style');
    el.id = 'styler-id';
    document.head.appendChild(el);

    function styler(styleTxt){
        if(typeof styleTxt !== 'string') {
            throw 'styleTxt must be a string';
        }
        el.innerHTML += styleTxt + ' ';
    }

    styler(topLevelCss);

    return styler;
});
