/**
 * 来源: https://stackoverflow.com/questions/70205816/intercept-websocket-messages
 */
let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener('load', function() {
        //console.log(this.responseText); //替换成你要的...
    });
    return oldXHROpen.apply(this, arguments);
};