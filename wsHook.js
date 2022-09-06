"use strict";
/* wsHook.js
 * https://github.com/skepticfx/wshook
 * Reference: http://www.w3.org/TR/2011/WD-websockets-20110419/#websocket
 */
var wsHook = {};
(function() {
    function MutableMessageEvent(o) {
        this.bubbles = o.bubbles || false;
        this.cancelBubble = o.cancelBubble || false;
        this.cancelable = o.cancelable || false;
        this.currentTarget = o.currentTarget || null;
        this.data = o.data || null;
        this.defaultPrevented = o.defaultPrevented || false;
        this.eventPhase = o.eventPhase || 0;
        this.lastEventId = o.lastEventId || '';
        this.origin = o.origin || '';
        this.path = o.path || new Array(0);
        this.ports = o.parts || new Array(0);
        this.returnValue = o.returnValue || true;
        this.source = o.source || null;
        this.srcElement = o.srcElement || null;
        this.target = o.target || null;
        this.timeStamp = o.timeStamp || null;
        this.type = o.type || 'message';
        this.__proto__ = o.__proto__ || MessageEvent.__proto__;
    }

    var before = wsHook.before = function(data, url, wsObject) {
		console.log("Sending WebSocket message to " + url + " : " + data); //发送的数据,替换成你要的...
        return data;
    };
    var after = wsHook.after = function(e, url, wsObject) {
		console.log("Received WebSocket message from " + url + " : " + e.data); //接收的数据,替换成你要的...
        return e;
    };
    var modifyUrl = wsHook.modifyUrl = function(url) {
        return url;
    };
    wsHook.resetHooks = function() {
        wsHook.before = before;
        wsHook.after = after;
        wsHook.modifyUrl = modifyUrl;
    };

    var _WS = WebSocket;
    WebSocket = function(url, protocols) {
        var WSObject;
        url = wsHook.modifyUrl(url) || url;
        this.url = url;
        this.protocols = protocols;
        if (!this.protocols) {
            WSObject = new _WS(url);
        } else {
            WSObject = new _WS(url, protocols);
        }

        var _send = WSObject.send;
        WSObject.send = function(data) {
            arguments[0] = wsHook.before(data, WSObject.url, WSObject) || data;
            _send.apply(this, arguments);
        };

        WSObject._addEventListener = WSObject.addEventListener;
        WSObject.addEventListener = function() {
            var eventThis = this;
            if (arguments[0] === 'message') {
                arguments[1] = (function(userFunc) {
                    return function instrumentAddEventListener() {
                        arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject);
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
                var onMessageHandler = function() {
                    arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject);
                    if (arguments[0] === null) {
                        return;
                    }
                    userFunc.apply(eventThis, arguments);
                };
                WSObject._addEventListener.apply(this, ['message', onMessageHandler, false]);
            }
        });

        return WSObject;
    };
    WebSocket.CONNECTING = _WS.CONNECTING;
    WebSocket.OPEN = _WS.OPEN;
    WebSocket.CLOSING = _WS.CLOSING;
    WebSocket.CLOSED = _WS.CLOSED;
})();