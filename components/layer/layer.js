// components/layer/layer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propGetGold: {
      type: Number,
      vlaue: {}
    },
    propGuessError: {
      type: Boolean,
      vlaue: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    success: false,
    eorr: false
  },
  observers: {
    'propGetGold,propGuessError': function(propGetGold, propGuessError) {
      let that = this
      if (propGetGold >= 0) {
        that.setData({
          success: true
        })
      } else if (propGuessError && propGetGold < 0) {
        that.setData({
          eorr: true
        })
      }
    },
    // 'propGuessError': function(propGuessError) {
    //   let that = this
    //   if (propGuessError) {
    //     that.setData({
    //       eorr: true
    //     })
    //   }
    // },
  },
  attached() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeSuccess: function() {
      let that = this;
      that.setData({
        success: false
      })
    },
    closeEorr: function() {
      let that = this;
      that.setData({
        eorr: false
      })
    }
  }
})