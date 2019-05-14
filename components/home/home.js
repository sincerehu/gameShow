const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propA: {
      type: String,
      value: ""
    },
    propPoint: {
      type: Object,
      value: ""
    },
    propTeam: {
      type: Object,
      value: {}
    },
    propResult: {
      type: Object,
      value: {}
    },
    // 礼物信息
    propGiftShow: {
      type: Object,
      value: {}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    giftArr: [],
    animation: true,
    scrollTop: 300,
    giftTop: 300,
    heightInfo: '',
    maxHeight: '',
    minHeight: '',
    message: '',
    chatArr: [{
      name: "管理员",
      message: '欢迎来到聊天室，爱你哟~',
      avatarUrl: "/images/biaoqing.png"
    }],
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [], //qq、微信原始表情
    alipayEmoji: [], //支付宝表情
  },
  observers: {
    'propResult': function(propResult) {
      if (!propResult.userInfo) {
        return
      }
      var that = this
      var arr = that.data.chatArr;
      arr.push({
        name: propResult.userInfo[0].nickName,
        avatarUrl: propResult.userInfo[0].avatarUrl,
        message: propResult.content[0].content
      })
      that.setData({
        heightInfo: that.data.maxHeight,
        chatArr: arr,
        scrollTop: that.data.scrollTop + 300
      })
    },
    'propGiftShow': function(propGiftShow) {
      if (propGiftShow.code == 0) {
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
      } else if (!propGiftShow.userInfo) {
        return
      }
      var that = this;
      var arr = that.data.giftArr

      arr.push(that.data.propGiftShow)
      that.setData({
        giftArr: arr,
        giftTop: that.data.giftTop + 300
      })
      console.log(that.data.giftTop)
    }
  },
  lifetimes: {
    attached() {
      var that = this;

      // 获取高度
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            maxHeight: res.windowHeight - 175,
            heightInfo: res.windowHeight - 175,
            minHeight: res.windowHeight - 175 - 225
          })
        }
      })

      // emoji表情
      var em = {},
        that = this,
        emChar = that.data.emojiChar.split("-");
      that.data.emoji.forEach(function(v, i) {
        em = {
          char: emChar[i],
          emoji: "0x1f" + v
        };
        that.data.emojis.push(em)
      });
      that.setData({
        emojis: that.data.emojis
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

    send: function(e) {
      var that = this,
        val = that.data.message,
        params = {
          "type": "barrage",
          "group": "mini",
          "content": val,
          "scene": "q12sd234",
          "openid": app.globalData.userInfo.open_id
        }
      if (!val || val.match(/^[ ]+$/)) {
        wx.showToast({
          title: '输入不能为空~',
          icon: 'none',
          duration: 2000
        })
        return
      }
      that.setData({
        isShow: false,
        message: ''
      })
      app.sendSocketMessage(JSON.stringify(params))
    },
    emojiScroll: function(e) {},
    textArea: function(e) {
      //获取此时文本域值
      this.setData({
        message: e.detail.value
      })
    },
    //文本域获得焦点事件处理
    textAreaFocus: function(e) {
      var that = this;
      this.setData({
        heightInfo: that.data.maxHeight
      })
    },
    //点击表情显示隐藏表情盒子
    emojiShowHide: function() {
      var that = this;
      var heightInfo = '';
      if (!that.data.isShow) {
        heightInfo = that.data.minHeight
      } else {
        heightInfo = that.data.maxHeight
      }
      that.setData({
        isShow: !that.data.isShow,
        heightInfo: heightInfo
      })
    },
    //表情选择
    emojiChoose: function(e) {
      //当前输入内容和表情合并
      this.setData({
        message: this.data.message + e.currentTarget.dataset.emoji,
      })
    },
    //点击emoji背景遮罩隐藏emoji盒子
    cemojiCfBg: function() {
      var that = this;
      this.setData({
        isShow: false,
        heightInfo: that.data.maxHeight
      })
    },
    // 向父级传个人信息
    showGift: function(e) {
      this.triggerEvent("isShowGiftEven", true)
    },
    // 叛变
    betrayal: function() {
      var that = this;
      var params = {
        "type": "betray",
        "teamid": wx.getStorageSync('team_id') == 1 ? "2" : "1",
        "scene": "q12sd234",
        "openid": app.globalData.userInfo.open_id,
        "isbetray": "1"
      }
      wx.showModal({
        title: '提示',
        content: '召唤师，确定要叛变么？',
        success(res) {
          if (res.confirm) {
            app.sendSocketMessage(JSON.stringify(params))
          }
        }
      })
    }
  }
})