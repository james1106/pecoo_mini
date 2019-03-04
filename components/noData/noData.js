var app = getApp();
Component({
  properties: {
    html: {
      type: String,
      value: '暂无数据'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data: {
    baseImg: app.globalData.baseImageUrl
  }
})