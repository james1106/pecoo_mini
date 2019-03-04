const app = getApp()
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    useVoucherList: [],
    selectedId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedId: options.voucherId,
      useVoucherList: JSON.parse(options.voucherList)
    })
  },
  // 点击优惠券
  clickVoucher (e) {
    let obj = e.currentTarget.dataset;
    this.setData({
      selectedId: obj.id || ''
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.changeVoucher(obj);
  },
  // 不实用优惠券
  notUseVoucher () {
    this.setData({
      selectedId: ''
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.changeVoucher();
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