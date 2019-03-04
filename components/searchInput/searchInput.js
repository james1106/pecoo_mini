const app = getApp()
Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索您喜欢的'
    },
    width: {
      type: String,
      value: '90%'
    },
    searchVal: {
      type: String,
      value: ''
    },
    isTake: {
      type: Boolean,
      value: false
    },
    focus: {
      type: Boolean,
      value: false
    }
  },
  data: {
    baseImg: app.globalData.baseImageUrl,
    searchContent: '',
    delFlag: false
  },
  methods: {
    // 失去焦点
    handleBlur(e) {
      let val = e.detail.value
      this.setData({
        searchContent: val
      })
      this.triggerEvent('myevent', e)
    },
    // 获取焦点事件
    handleFocus (e) {
      let val = e.detail.value
      if (val) {
        this.setData({
          delFlag: true
        })
      } else {
        this.setData({
          delFlag: false
        })
      }
      this.triggerEvent('myevent', e)
    },
    // 点击键盘按钮触发
    handleBtn (e) {
      let val = e.detail.value;
      this.setData({
        searchContent: val
      })
      this.triggerEvent('myevent', e)
    },
    // change事件
    handleInput (e) {
      if (e.detail.value) {
        this.setData({
          delFlag: true
        })
      } else {
        this.setData({
          delFlag: false
        })
      }
      this.triggerEvent('myevent', e)
    },
    // 删除内容
    clearContent () {
      this.setData({
        searchContent: '',
        delFlag: false
      })
      this.triggerEvent('clearContent', this.data.searchContent)
    },
    // 调用相机
    takePhoto () {
      var that = this;
      wx.chooseImage({
        count: 1, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          that.setData({
            tempFilePaths: res.tempFilePaths
          })
        }
      })
    },
    // 外部传入参数改变父组件的内容
    changeSearchContent (val) {
      this.setData({
        searchContent: val
      })
    }
  }
})