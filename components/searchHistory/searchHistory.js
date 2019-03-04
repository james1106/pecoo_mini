const app = getApp()
Component({
  properties: {
    historyData: {
      type: Array,
      value: []
    },
    recommendData: {
      type: Array,
      value: []
    },
    url: {
      type: String,
      value: ''
    }
  },
  data: {
    baseImg: app.globalData.baseImageUrl
  },
  methods: {
    delHistory (e) {
      this.triggerEvent('delHistory', e)
    },
    changeSearchContent (e) {
      this.triggerEvent('changeSearchContent', e)
    }
  }
})