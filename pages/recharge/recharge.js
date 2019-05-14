// pages/recharge/recharge.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fee: '0.01',
    gold: null,
    money: [{
        gold: 100,
        money: .01
      },
      {
        gold: 600,
        money: 5
      }, {
        gold: 1200,
        money: 10
      }, {
        gold: 6000,
        money: 50
      }, {
        gold: 13000,
        money: 100
      }, {
        gold: 30000,
        money: 200
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      gold: app.globalData.gold
    })
  },
  getFee: function(e) {
    let that = this
    that.setData({
      fee: e.currentTarget.dataset.fee
    })
  },
  pay: function() {
    let that = this;
    const params = {
      wxapp_id: '10001',
      openid: app.globalData.userInfo.open_id,
      fee: that.data.fee,
    }
    app.request('s=/api/charge/pay', 'POST', params, function(e) {
      wx.requestPayment({
        timeStamp: e.data.timeStamp,
        nonceStr: e.data.nonceStr,
        package: e.data.package,
        signType: e.data.signType,
        paySign: e.data.paySign,
        success(res) {
          console.log(res)
          let params = {
            "type": "gold",
            "scene": "q12sd234",
            "openid": app.globalData.userInfo.open_id,
          }
          app.sendSocketMessage(JSON.stringify(params))
        },
        fail(res) {
          console.log(res)
        }
      })
    }, function(e) {
      console.log(e)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this,
      data;
    app.initSocket(function(e) {
      if (typeof(e.data) == 'string' && e.data) {
        data = JSON.parse(e.data)
      }
      if (data.type == "gold") {
        // gold
        console.log("gold" + data.result[0].gold)
        that.setData({
          gold: data.result[0].gold
        })
        app.globalData.gold = data.result[0].gold
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})