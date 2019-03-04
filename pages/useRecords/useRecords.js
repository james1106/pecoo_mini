var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    useRecordsObj: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.voucherDetail({
      voucherId: options.id,
      userId: app.getUserId()
    }).then(data => {
      this.setData({
        useRecordsObj: data
      })
    })
  },
  goAuctionDetail () {
    console.log(this.data.useRecordsObj.useOrderId)
    wx.navigateTo({
      url: '/pages/auctionOrderDetail/auctionOrderDetail?orderId=' + this.data.useRecordsObj.useOrderId,
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
    
  }
})