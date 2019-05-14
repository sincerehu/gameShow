// components/login.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propTeam:{
      type:Object,
      value:{}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    team: {}
  },
  lifetimes: {
    attached() {
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 向父级传个人信息
    getUserInfo: function(e) {
      wx.setStorageSync('team_id', e.currentTarget.dataset.id)
      if (e.detail.userInfo) {
        this.triggerEvent("userInfoEven", e.detail)
      }
    },
  }
})