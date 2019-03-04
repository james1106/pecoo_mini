Component({
  properties: {
    pic: String,
    goodsName: String,
    color: String,
    size: String,
    priceUnit: String,
    price: String,
    num: Number,
    orderId: String,
    isGo: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    jump () {
      if (this.data.isGo) {
        wx.navigateTo({
          url: `/pages/extravagancesOrderDetail/extravagancesOrderDetail?orderId=${this.data.orderId}`
        })
      }
    }
  }
})