const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    applyCause: '', // 申请的原因
    problemDesc: '', //  申请的问题描述
    picture: [], // 申请的照片
    baseImg: app.globalData.baseImageUrl,
    textareaWidth: 335, // 默认的textarea的值
    reasonType: '',
    showPopup: false,
    curNumber: 0,
    disable: false,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let textareaWidth = 0
    try {
      const res = wx.getSystemInfoSync()
      textareaWidth = res.windowWidth - 40
    } catch (e) {
      // Do something when catch error
    }
    api.getCustomerService({
      userId: app.getUserId(),
      orderId: options.orderId,
      goodsId: options.goodsId
    }).then(data => {
      let applyCause = '请选择申请原因'
      if (data.customerService) {
        if (data.customerService.reasonType == 'd') {
          applyCause = '丢货'
        } else if (data.customerService.reasonType == 'p') {
          applyCause = '碎货'
        }
      }
      this.setData({
        orderId: options.orderId,
        goodsId: options.goodsId,
        goods: data.goods,
        textareaWidth: textareaWidth,
        applyCause: applyCause,
        problemDesc: data.customerService ? data.customerService.problemDesc : '',
        picture: data.customerService ? data.customerService.picture.split(',') : [],
        curNumber: data.customerService ? data.customerService.problemDesc.length : 0,
        reasonType: data.customerService ? data.customerService.reasonType : '',
        id: data.customerService ? data.customerService.id : ''
      })
    })
  },
  // 申请原因的类型
  changeType (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      reasonType: type,
      showPopup: false,
      applyCause: type == 'd' ? '丢货' : '碎货'
    })
  },
  //问题描述
  changeText (e) {
    this.setData({
      curNumber: e.detail.cursor,
      problemDesc: e.detail.value
    })
  },
  // 选取图片
  selectPic () {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.uploadPic(tempFilePaths[0])
      }
    })
  },
  // 删除图片
  deletePic (e) {
    let index = e.currentTarget.dataset.index
    this.data.picture.splice(index, 1)
    this.setData({
      picture: this.data.picture
    })
  },
  // 图片上传
  uploadPic (pic) {
    const that = this
    wx.uploadFile({
      url: app.globalData.host + api.afterSalesUpload,
      filePath: pic,
      name: 'file',
      header: {
        accessToken: wx.getStorageSync('userInfo').tokenId || '',
        version: 'V1.0.4',
        clientTime: new Date().getTime(),
        sourceMode: 'MINI'
      },
      formData: {
        'userId': app.getUserId(),
        'namespace': 'comtuserService',
      },
      success(res) {
        let data = JSON.parse(res.data)
        that.setData({
          picture: that.data.picture.concat(data.result)
        })
      },
      fail(err) {
        app.showErrorModal(res.data.msg)
      }
    })
  },
  // 显示申请的售后类型
  showType () {
    this.setData({
      showPopup: true
    })
  },
  // 关闭弹窗
  close () {
    this.setData({
      showPopup: false
    })
  },
  // 点击查看
  look () {
    wx.navigateTo({
      url: `/pages/webviewPage/webviewPage?url=${'https://h5.pecoo.com/pecoo_pay/After.html'}`,
    })
  },
  // 提交
  submit () {
    if (!this.data.reasonType) {
      return app.showToast('请选择申请原因')
    } else if (!this.data.problemDesc) {
      return app.showToast('请添加文字描述')
    } else if (!this.data.picture.length) {
      return app.showToast('请上传图片')
    } else if (this.data.picture.length < 5) {
      return app.showToast('上传图片至少为5张哦~')
    }
    if (this.data.disable) return
    this.setData({
      disable: true
    })
    api.updateAfterSales({
      id: this.data.id,
      userId: app.getUserId(),
      orderId: this.data.orderId,
      goodsId: this.data.goodsId,
      reasonType: this.data.reasonType,
      problemDesc: this.data.problemDesc,
      picture: this.data.picture.join(',')
    }).then(data => {
      app.showToast('提交成功', 'success')
      setTimeout(() => {
        wx.navigateBack({
          delta: 2
        })
        this.setData({
          disable: false
        })
      }, 2000)
    }).catch(err => {
      app.showToast('提交失败，请重试')
      this.setData({
        disable: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})