const app = getApp();
Component({
  properties: {
    bottom: {
      type: String,
      value: '210rpx'
    }
  },
  data: {
    baseImg: app.globalData.baseImageUrl
  },
  methods: {
    goHome () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
  }
})