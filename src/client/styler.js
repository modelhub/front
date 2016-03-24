define('styler', [
    'text!topLevelCss'
], function(
    topLevelCss
){
    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,300';
    font.type = 'text/css';
    document.head.appendChild(font);

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
