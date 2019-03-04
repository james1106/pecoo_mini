Component({
  properties: {
    thumbnailUrl: String,
    goodsName: String,
    priceUnit: String,
    clientPrice: String,
    startTimeShow: String,
    address: String,
    goodsId: String
  },
  methods: {
    goPages () {
      if (this.data.goodsId) {
        wx.navigateTo({
          url: `/pages/detail/detail?id=${this.data.goodsId}`,
        })
      }
    }
  }
})