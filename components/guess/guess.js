// components/guess/guess.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propSubject: {
      type: Object,
      vlaue: {}
    },
    propGold: {
      type: String,
      vlaue: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    result: 1,
    hideGuess: true,
    value: 100,
    add: [{
      money: 100
    }, {
      money: 300
    }, {
      money: 500
    }, {
      money: "重置"
    }]
  },
  lifetimes: {
    attached() {
      let that = this;
      if (that.data.propSubject.isFirst) {
        this.setData({
          hideGuess: false
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    sendPoin: function() {
      let that = this;
      if (that.data.value > that.data.propGold) {
        wx.showModal({
          title: '提示',
          content: '积分不足，去充值',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/recharge/recharge',
              })
            }
          }
        })
        return
      } else if (that.data.value == 0) {
        wx.showToast({
          title: '请输入下注金额~',
          icon: 'none',
          duration: 2000
        })
        return
      }
      console.log(that.data.value)
      let params = {
        "type": "bets",
        "group": "mini",
        "scene": "q12sd234",
        "openid": app.globalData.userInfo.open_id,
        "subject_id": that.data.propSubject.id,
        "option": that.data.result,
        "price": that.data.value
      }
      app.sendSocketMessage(JSON.stringify(params))
      that.setData({
        hideGuess: true
      })
      wx.showToast({
        title: '下注成功~',
        icon: 'none',
        duration: 2000
      })
    },
    closeGuess: function() {
      this.setData({
        hideGuess: true
      })
    },
    showGuess: function() {
      let params = {
        "type": "gold",
        "scene": "q12sd234",
        "openid": app.globalData.userInfo.open_id,
      }
      app.sendSocketMessage(JSON.stringify(params))
      this.setData({
        hideGuess: false
      })
    },
    textArea: function(e) {
      //获取此时文本域值
      this.setData({
        value: parseInt(e.detail.value)
      })
    },
    getResult(e) {
      console.log(e.currentTarget.dataset.result)
      this.setData({
        result: e.currentTarget.dataset.result
      })
    },
    navRecharge: function() {
      wx.navigateTo({
        url: '/pages/recharge/recharge',
      })
    },
    addMoney: function(e) {
      var money = e.currentTarget.dataset.money,
        that = this;
      if (money == "重置") {
        that.setData({
          value: 100
        })
      } else {
        that.setData({
          value: that.data.value + money
        })
      }
    }
  }
})