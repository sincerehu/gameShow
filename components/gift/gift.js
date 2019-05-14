// components/gift/gift.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propMember: {
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
    isShow: true,
    // 选择的选手
    personid: 0,
    // 选择的战队
    teamid: 0,
    // 选择的礼物
    gifts_id: 0,
    price: '',
    dots: false,
    act: 0,
    gift: [],
    member: {},
    team: {},
    gold: ''
  },
  lifetimes: {
    attached() {
      var arr = app.globalData.info.gift
      const len = arr.length
      let result = []
      const sliceNum = 4
      for (let i = 0; i < len / sliceNum; i++) {
        result.push(arr.slice(i * sliceNum, (i + 1) * sliceNum))
      }
      for (let j = 0; j < (sliceNum - len % sliceNum); j++) {
        result[result.length - 1].push({})
      }
      console.log(app.globalData.info)
      this.setData({
        gift: result,
        member: app.globalData.info.member,
        team: app.globalData.info.team,
        gold: app.globalData.info.gold
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 控制选择战队还是选手的navbar
    getAct: function(e) {
      this.setData({
        act: e.currentTarget.dataset.act
      })
    },
    // 监听战队选手的swiper
    swiperChange: function(e) {
      console.log(e.detail.current)
      if (e.detail.current == 0) {
        this.setData({
          personid: 0
        })
      } else {
        this.setData({
          teamid: 0
        })
      }
      this.setData({
        act: e.detail.current
      })
    },
    // 选择的礼物
    getGift: function(e) {
      console.log(e.currentTarget.dataset.id)
      this.setData({
        gifts_id: e.currentTarget.dataset.id,
        price: e.currentTarget.dataset.price,
      })
    },
    // 选择的战队
    getTeam: function(e) {
      this.setData({
        teamid: e.currentTarget.dataset.teamid
      })
    },
    // 选择的选手
    getPerson: function(e) {
      this.setData({
        personid: e.currentTarget.dataset.id
      })
    },
    // 向父级传个人信息
    hideGift: function(e) {
      this.triggerEvent("isHideGiftEven", true)
    },
    // 发送礼物
    sendGift: function() {
      var that = this;
      var params = {
        "type": "sendgift",
        "group": "mini",
        "scene": "q12sd234",
        "openid": app.globalData.userInfo.open_id,
        "giftid": that.data.gifts_id,
        "teamid": that.data.teamid,
        "memberid": that.data.personid,
        "price": that.data.price,
      }
      if (params.giftid == 0) {
        wx.showToast({
          title: '请选择礼物~',
          icon: 'none',
          duration: 2000
        })
      } else if (params.teamid == 0 && params.memberid == 0) {
        wx.showToast({
          title: '请选择战队或者选手~',
          icon: 'none',
          duration: 2000
        })
      } else if (that.data.price > that.data.propGold) {
        wx.showModal({
          title: '提示',
          content: '积分不足，去充值',
          success(res) {
            if (res.confirm) {
              that.triggerEvent("isHideGiftEven", true)
              wx.navigateTo({
                url: '/pages/recharge/recharge',
              })
            }
          }
        })
      } else {
        this.triggerEvent("isHideGiftEven", true)
        app.sendSocketMessage(JSON.stringify(params))
      }
    },
    navRecharge: function() {
      wx.navigateTo({
        url: '/pages/recharge/recharge',
      })
      this.hideGift()
    }
  }
})