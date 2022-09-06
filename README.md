# Web-inject
为Chrome浏览器注入脚本以截获Websocket和Ajax数据

原理:
用js重写window.Websocket原生方法,外面包装一层,有现成的项目支持: https://github.com/skepticfx/wshook

重写的方法必须在被注入页面调用new Websocket之前生效,所以必须弄一个Chrome Extension确保尽早完成重写

如果只需监听收到的数据,这里有很好的解决方案: https://stackoverflow.com/questions/70205816/intercept-websocket-messages
