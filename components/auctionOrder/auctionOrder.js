Component({
  properties: {
    marginVal: {
      type: String,
      value: '0 0 0 0'
    },
    clientPrice: String,
    transPrice: String,
    pic: String,
    goodsId: String,
    priceUnit: String,
    goodsName: String,
    disable: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    jump () {
      if (!this.data.disable) {
        wx.navigateTo({
          url: `/pages/detail/detail?goodsId=${this.data.goodsId}`,
        })
      }
    }
  }
})