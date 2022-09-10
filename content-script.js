function loadJS(js) {
    var elm = document.createElement("script");
    elm.src = chrome.runtime.getURL(js);
    elm.type = 'text/javascript';
    elm.charset = 'UTF-8';
    elm.async = false;
    elm.onload = function() {
        this.parentNode.removeChild(this); //注入已经完成,删除标签以避免破坏页面结构
    };

    if (document.documentElement) {
        document.documentElement.appendChild(elm);
    } else if (document.getElementsByTagName('head').length) {
        document.getElementsByTagName('head')[0].appendChild(elm);
    } else { //加载失败
        //alert("Inject error...");
    }
}
loadJS("hook.js");