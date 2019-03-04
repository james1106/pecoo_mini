const app = getApp()
Component({
  properties: {
    userName: String,
    mobile: String,
    address: String,
    showArrow: {
      type: Boolean,
      value: true
    }
  },
  data: {
    baseImg: app.globalData.baseImageUrl
  },
  methods: {
    clickEvent () {
      this.triggerEvent('eventHandle')
    }
  }
})