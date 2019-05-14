// function socket(success) {
//     var ws = new WebSocket("wss://electronic.hunterslab.cn/wss");

//     ws.onopen = function (evt) {
//         console.log('连接')
//         var params = { "type": "screenjoin", "group": "screen", "scene": "q12sd234" }
//         ws.send(JSON.stringify(params));
//     };

//     ws.onmessage = function (evt) {
//         var message = evt.data
//         console.log(typeof (message))
//         if (typeof (message) == 'string') {
//             var data = JSON.parse(message)
//         }
//         success(data)
//     };
//     ws.onclose = function () {
//         console.log('断开')
//         console.log(ws.readyState)
//         socket()
//     };
//     var params = {
//         "type": "heart",
//         "group": "screen",
//         "scene": "q12sd234"
//     }
//     setInterval(function () {
//         if (ws.readyState !== 0 && ws.readyState !== 1) {
//             console.log(ws.readyState)
//             socket()
//         }
//         if (ws.readyState == 1) {
//             console
//             ws.send(JSON.stringify(params));
//         }
//     }, 8000);
// }
var newurl = updateQueryStringParameter(window.location.href, 'scene', 'q12sd234');
//向当前url添加参数，没有历史记录
window.history.replaceState({
    path: newurl
}, '', newurl);

function updateQueryStringParameter(uri, key, value) {
    if (!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}




(function ($) {

    $.config = {
        url: '', //链接地址
    };

    $.init = function (config) {
        this.config = config;
        return this;
    };

	/**
	 * 连接webcocket
	 */
    $.connect = function () {
        var protocol = (window.location.protocol == 'http:') ? 'ws:' : 'wss:';
        this.host = protocol + this.config.url;

        window.WebSocket = window.WebSocket || window.MozWebSocket;
        if (!window.WebSocket) { // 检测浏览器支持  
            this.error('Error: WebSocket is not supported .');
            return;
        }
        this.socket = new WebSocket(this.host); // 创建连接并注册响应函数  
        this.socket.onopen = function () {
            let params = {
                "type": "heart",
                "group": "screen",
                "scene": "q12sd234"
            }
            setInterval(function () {
                $.send(JSON.stringify(params));
            }, 8000);
            var params2 = { "type": "screenjoin", "group": "screen", "scene": "q12sd234" }
            $.send(JSON.stringify(params2));
            $.onopen();
        };
        this.socket.onmessage = function (message) {
            $.onmessage(message);
        };
        this.socket.onclose = function () {
            $.onclose();
            $.socket = null; // 清理  
        };
        this.socket.onerror = function (errorMsg) {
            $.onerror(errorMsg);
        }
        return this;
    }

	/**
	 * 自定义异常函数
	 * 
	 */
    $.error = function (errorMsg) {
        this.onerror(errorMsg);
    }

	/**
	 * 消息发送
	 */
    $.send = function (message) {
        if (this.socket) {
            this.socket.send(message);
            return true;
        }
        this.error('please connect to the server first !!!');
        return false;
    }

    $.close = function () {
        if (this.socket != undefined && this.socket != null) {
            this.socket.close();
        } else {
            this.error("this socket is not available");
        }
    }

	/**
	 * 消息回調
	 *
	 */
    $.onmessage = function (message) {

    }

	/**
	 * 链接回调函数
	 */
    $.onopen = function () {

    }

	/**
	 * 关闭回调
	 */
    $.onclose = function () {

    }

	/**
	 * 异常回调
	 */
    $.onerror = function () {

    }

})(ws = {});
ws.init({
    url: "//electronic.hunterslab.cn/wss"
    // 后台接口地址
}).connect();