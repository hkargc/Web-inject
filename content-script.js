/**
 * 加载注入js也需要时间,为了确保在页面所有JS执行前注入,必须先清空浏览器缓存!!!
 * 关键在appendChild处,因为是"run_at": "document_start",执行到该处head还没渲染出来
 * 参见: https://stackoverflow.com/questions/28186349/chrome-extension-set-to-run-at-document-start-is-running-too-fast
 **/
function loadJS(js){
	var elm = document.createElement("script");
	elm.src = chrome.extension.getURL(js);
	elm.type = 'text/javascript';
    elm.charset = 'UTF-8';
	elm.async = false;
	elm.onload = function(){
		this.parentNode.removeChild(this); //注入已经完成,删除标签以避免破坏页面结构
	};
	
	if(document.documentElement){
		document.documentElement.appendChild(elm);
	}else if(document.getElementsByTagName('head').length){
		document.getElementsByTagName('head')[0].appendChild(elm);
	}else{ //加载失败
		//alert("Inject error...");
	}
}
loadJS("wsHook.js"); //Websocket注入
loadJS("xhrHook.js"); //Ajax注入