"use strict";
/**
 * 这里的代码来源于:
 * https://github.com/skepticfx/wshook
 * https://stackoverflow.com/questions/70205816/intercept-websocket-messages
 */
(function() {
    var _WebSocket = WebSocket;
    function before(data, url, wsObject) {
        console.log("Sending WebSocket message to " + url + " : " + data); //替换成你要的...
		return data;
    };
    function after(e, url, wsObject) {
        console.log("Received WebSocket message from " + url + " : " + e.data); //替换成你要的...
        return e;
    };
    window.WebSocket = function(url, protocols) {
        var WSObject;
        this.url = url;
        this.protocols = protocols;
        if (this.protocols) {
            WSObject = new _WebSocket(url, protocols);
        } else {
            WSObject = new _WebSocket(url);
        }

        var _send = WSObject.send;
        WSObject.send = function(data) {
            arguments[0] = before(data, WSObject.url, WSObject) || data;
            _send.apply(this, arguments);
        };

        WSObject._addEventListener = WSObject.addEventListener;
        WSObject.addEventListener = function() {
            var eventThis = this;
            if (arguments[0] === 'message') {
                arguments[1] = (function(userFunc) {
                    return function() {
                        arguments[0] = after(arguments[0], WSObject.url, WSObject);
                        if (arguments[0] === null) {
                            return;
                        }
                        userFunc.apply(eventThis, arguments);
                    };
                })(arguments[1]);
            }
            return WSObject._addEventListener.apply(this, arguments);
        }

        Object.defineProperty(WSObject, 'onmessage', {
            'set': function() {
                var eventThis = this;
                var userFunc = arguments[0];
                var onmessage = function() {
                    arguments[0] = after(arguments[0], WSObject.url, WSObject);
                    if (arguments[0] === null) {
                        return;
                    }
                    userFunc.apply(eventThis, arguments);
                };
                WSObject._addEventListener.apply(this, ['message', onmessage, false]);
            }
        });

        return WSObject;
    };
    WebSocket.CONNECTING = _WebSocket.CONNECTING;
    WebSocket.OPEN = _WebSocket.OPEN;
    WebSocket.CLOSING = _WebSocket.CLOSING;
    WebSocket.CLOSED = _WebSocket.CLOSED;

    var _XHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('load', function(e) {
            console.log("Received Ajax message from " + this.responseURL + " : " + this.responseText); //替换成你要的...
        });
        return _XHROpen.apply(this, arguments);
    };
    var _XHRSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function(body) {
		console.log("Sending Ajax message:" + body); //替换成你要的...
        return _XHRSend.apply(this, arguments);
    };
})();