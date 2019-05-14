//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    getGold: -1,
    guessError: false,
    userInfo: {},
    isLogin: true,
    isGift: false,
    team: {},
    bgImg: "",
    is_betray: 0,
    sumPoint: {},
    subject: {},
    result: {},
    member: {},
    giftResult: {},
    gold: '',
    canShow: true
  },
  onLoad: function() {
    var that = this
    that.login()
  },
  onHide() {
    app.globalData.localSocket.close()
  },
  onReady: function() {
    var that = this,
      params = {
        "type": "heart",
        "group": "mini",
        "scene": "q12sd234"
      }
    setInterval(function() {
      app.sendSocketMessage(JSON.stringify(params))
    }, 10000);

  },
  // 显示礼物组件
  isShowGiftEven: function(e) {
    this.setData({
      isGift: true,
    })
    var that = this,
      params = {
        "type": "gold",
        "scene": "q12sd234",
        "openid": app.globalData.userInfo.open_id,
      }
    app.sendSocketMessage(JSON.stringify(params))
  },
  // 隐藏礼物组件
  isHideGiftEven: function(e) {
    this.setData({
      isGift: false
    })
  },
  // 登录
  login: function(e) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          var params = {
            code: res.code,
            wxapp_id: 10001,
          };
          app.request('s=/api/info/detail', 'POST', params, function(e) {
            if (e.data.data.team_id) {
              app.globalData.userInfo = e.data.data.user_info[0];
              that.setData({
                userInfo: e.data.data.user_info[0],
                is_betray: e.data.data.is_betray
              })
              wx.setStorageSync('team_id', e.data.data.team_id)
              that.setColor(e.data.data.team_id)
              that.getSubject()
              that.sendOpenId(e.data.data.user_info[0].open_id)
            } else {
              that.setData({
                isLogin: false
              })
            }
          }, function(e) {
            console.log(e)
          })
        } else {}
      }
    })
  },
  // 获取竞猜题目
  getSubject: function() {
    let params = {
        wxapp_id: 10001,
        scene_id: 'q12sd234'
      },
      that = this;
    app.request('s=/api/subject/subject', 'POST', params, function(data) {
      if (data.data.data.subject[0]) {
        that.setData({
          subject: data.data.data.subject[0]
        })
      }
    }, function(e) {
      console.log(e)
    })
  },

  setTeam: function(e) {
    this.setColor(e.detail)
  },
  // 设置导航背景
  setColor: function(e) {
    var color = "",
      that = this
    if (e == 2) {
      color = '#16172f'
      that.setData({
        bgImg: "https://electronic.hunterslab.cn/web/uploads/bluebg.jpg"
      })
    } else {
      that.setData({
        bgImg: "https://electronic.hunterslab.cn/web/uploads/redbg.jpg"
      })
      color = '#2b0715'
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  sendOpenId: function(e) {
    var that = this,
      params = {
        "type": "bind",
        "scene": "q12sd234",
        "openid": e
      }
    app.sendSocketMessage(JSON.stringify(params))
  },
  // 初次获取用户信息
  userInfoEven: function(e) {
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          var params = {
            code: res.code,
            user_info: e.detail.userInfo,
            signature: e.detail.signature,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            wxapp_id: 10001
          };
          //发起网络请求
          app.request('s=/api/user/login', 'POST', params, function(data) {
            app.globalData.userInfo = data.data.data.user_id;
            that.setData({
              userInfo: data.data.data.user_id,
              isLogin: true
            })
            that.support(data.data.data.user_id.open_id)
            that.getSubject()
            that.sendOpenId(e.data.data.user_info[0].open_id)
          }, function(e) {
            console.log(e)
          })
        } else {}
      }
    })
  },
  // 用户选择支持战队
  support: function(e) {
    var that = this
    var params = {
      "type": "support",
      "teamid": wx.getStorageSync('team_id'),
      "scene": "q12sd234",
      "openid": e
    }
    app.sendSocketMessage(JSON.stringify(params))
  },
  shakeFun: function() { // 摇一摇方法封装
    var that = this
    var numX = 1 //x轴
    var numY = 1 // y轴
    var numZ = 0 // z轴
    var stsw = true // 开关，保证在一定的时间内只能是一次，摇成功
    var positivenum = 0 //正数 摇一摇总数
    wx.onAccelerometerChange(function(res) { //小程序api 加速度计
      if (numX < res.x && numY < res.y) { //一次正数算摇一次
        positivenum++
        setTimeout(() => {
          positivenum = 0
        }, 1000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (numZ < res.z && numY < res.y) { //可以上下摇，上面的是左右摇
        positivenum++
        setTimeout(() => {
          positivenum = 0
        }, 1000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (positivenum == 2 && stsw) { //是否摇了指定的次数，执行成功后的操作
        stsw = false
        that.shake()
        setTimeout(() => {
          positivenum = 0 // 摇一摇总数，重新0开始，计算
          stsw = true
        }, 1000)
      }
    })
  },
  shake: function() {
    var that = this
    wx.vibrateLong({
      success: function() {
        if (!that.data.isLogin) {
          wx.showToast({
            title: '请先选择战队~',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '人气值+1',
            icon: 'success',
            duration: 2000
          })
          var params = {
            "type": "sendpoint",
            "teamid": wx.getStorageSync('team_id'),
            "scene": "q12sd234",
            "group": "mini",
            "openid": app.globalData.userInfo.open_id,
            "point": "1"
          }
          app.sendSocketMessage(JSON.stringify(params))
        }
      }
    })
  },
  onShow: function(options) {
    var that = this,
      data;
    that.shakeFun()
    app.initSocket(function(e) {
      console.log(e.data)
      if (typeof(e.data) == 'string' && e.data) {
        data = JSON.parse(e.data)
      }
      if (data.type == "heart") {
        // heart
        console.log("heart")
      } else if (data.type == "sendpoint") {
        console.log("sendpoint" + data.result)
        that.setData({
          sumPoint: data.result
        })
      } else if (data.type == "barrage") {
        // barrage
        console.log("barrage")
        that.setData({
          result: data.result
        })
      } else if (data.type == "support") {
        // support
        console.log("support")
        wx.setStorageSync('team_id', data.result[0].team_id)
        that.setColor(data.result[0].team_id)
      } else if (data.type == "join") {
        // join
        console.log("join")
        app.globalData.info = data
        that.setData({
          sumPoint: data.point,
          team: data.team,
          member: data.member
        })
        console.log(app.globalData.info)
        wx.setNavigationBarTitle({
          title: data.scene[0].title
        })
        wx.hideLoading()
      } else if (data.type == "betray") {
        // betray
        console.log("betray")
        that.setColor(data.result[0].team_id)
        that.setData({
          is_betray: 1
        })
        wx.setStorageSync('team_id', data.result[0].team_id)

      } else if (data.type == "sendgift") {
        // sendgift
        console.log("sendgift" + data)
        that.setData({
          giftResult: data.result,
        })
      } else if (data.type == "gold") {
        // gold
        console.log("gold" + data.result[0].gold)
        that.setData({
          gold: data.result[0].gold
        })
        app.globalData.gold = data.result[0].gold
      } else if (data.type == "subject") {
        // subject
        console.log("subject" + data.subject[0])
        data.subject[0].isFirst = true
        that.setData({
          subject: data.subject[0]
        })
        let params = {
          "type": "gold",
          "scene": "q12sd234",
          "openid": app.globalData.userInfo.open_id,
        }
        app.sendSocketMessage(JSON.stringify(params))
      } else if (data.type == "bets") {
        // bets
        console.log("bets" + data)
      } else if (data.type == "guessCorrect") {
        // guessCorrect
        console.log("guessCorrect" + data.gold)
        that.setData({
          getGold: data.gold,
          canShow: true
        })
      } else if (data.type == "guessError") {
        // guessError
        console.log("guessError")
        that.setData({
          guessError: true,
          canShow: true
        })
      }
    })
    if (app.globalData.localSocket.readyState !== 0 && app.globalData.localSocket.readyState !== 1) {
      console.log('开始尝试连接WebSocket！readyState=' + app.globalData.localSocket.readyState)
      app.initSocket()
    }
  }
})