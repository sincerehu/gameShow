//app.js
//获取应用实例
var app = getApp();

App({
  onLaunch: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

  },

  globalData: {
    userInfo: null,
    miniInfo: null,
    // 场次编号
    scene_id: "q12sd234",
    localSocket: {},
    // callback: function() {},
  },
  // 请求公共方法
  request: function (url, method, params, success, fail) {
    params.scene_id = this.globalData.scene_id;
    wx.request({
      url: "https://electronic.hunterslab.cn/web/?" + url,
      method: method,
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.statusCode == 200) {
          success(res)
        } else {
          fail(res)
        }
      },
      fail: function(res) {
        fail(res)
      }
    })
  },
  // websocket公共方法
  initSocket(success) {
    let that = this
    that.globalData.localSocket = wx.connectSocket({
      //此处 url 可以用来测试
      url: 'wss://electronic.hunterslab.cn/wss'
    })
    //版本库需要在 1.7.0 以上
    that.globalData.localSocket.onOpen(function(res) {
      const firstMsg = {
        "type": "join",
        "group": "mini",
        "scene": "q12sd234"
      }
      that.sendSocketMessage(JSON.stringify(firstMsg))
    })
    that.globalData.localSocket.onError(function(res) {
    })
    that.globalData.localSocket.onClose(function(res) {
      // that.initSocket()
    })
    that.globalData.localSocket.onMessage(function(res) {
      // 用于在其他页面监听 websocket 返回的消息
      success(res)
    })
  },
  //统一发送消息，可以在其他页面调用此方法发送消息
  sendSocketMessage: function(msg) {
    let that = this
    return new Promise((resolve, reject) => {
      if (this.globalData.localSocket.readyState === 1) {
        console.log('发送消息', msg)
        this.globalData.localSocket.send({
          data: msg,
          success: function(res) {
            resolve(res)
          },
          fail: function(e) {
            reject(e)
          }
        })
      } else {
        console.log('已断开')
      }
    })
  },
  // riseUp: function (msg, success) {
  //   let that = this
  //   return new Promise((resolve, reject) => {
  //     that.sendSocketMessage(msg)
  //     that.globalData.callback = function(res) {
  //       success(res.data)
  //       // console.log(JSON.parse(res.data))
  //       resolve(res)
  //     }
  //   })
  // },
})