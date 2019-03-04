const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    certificatesList: [],
    pageNum: 1,
    back: '',
    pageSize: 10,
    orderId: '', // 当前订单
    cardId: null, // 清关证件得id
    receiveName: '' // 收货人的姓名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      back: options.back || 0,
      orderId: options.orderId || '',
      cardId: options.cardId || null,
      receiveName: options.receiveName || ''
    })
  },

  del (e) {
    let that = this;
    app.showModal('您确定删除吗？', function () {
      let obj = e.currentTarget.dataset
      api.delUserCard({
        userId: app.getUserId(),
        id: obj.id
      }).then(result => {
        that.data.certificatesList.splice(obj.index, 1);
        that.setData({
          certificatesList: that.data.certificatesList
        })
        if (that.data.back) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.reviceCredentials(that.data.certificatesList)
        }
      }) 
    }, function () {
      console.log('用户点击取消')
    })
  },
  edit (e) {
    wx.navigateTo({
      url: `/pages/uploadCard/uploadCard?id=${e.currentTarget.dataset.id}`,
    })
  },
  clickEvent (e) {
    let curCredential = this.data.certificatesList[e.currentTarget.dataset.index];
    if (this.data.back) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.changeIdCard(curCredential)
    } else {
      if ((!this.data.cardId && this.data.receiveName == curCredential.realNameClear) || (curCredential.id == this.data.cardId) || (this.data.cardId == 'null' && this.data.receiveName == curCredential.realNameClear)) {
        api.luxuryBindCard({
          orderId: this.data.orderId,
          cardId: curCredential.id,
          userId: app.getUserId()
        }).then(data => {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.bindIdCard(curCredential)
        })
      } else {
        if (this.data.cardId == null) return
        app.showToast('收货人姓名必须与清关证件姓名一致');
      }
    }
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
    api.userIdCardList({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: 10
    }).then(data => {
      this.setData({
        certificatesList: data.pageResult
      })
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})