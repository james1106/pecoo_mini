var app = getApp();
const api = require('../../utils/api.js')
var re2000 = /^[0-9]*[0-9]$/i; 
var re = /^(?=.*[1-9])\d+(\.\d{1,2})?$/i;  
// 01 余额   02 保证金
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    rechargeMoney:'', // 充值金额
    rechargeOrder:'01' // 充值类型
  },
  /**
   * 点击radio切换
   */
  change (e) {
    this.setData({
      rechargeOrder: e.currentTarget.dataset.val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  rechargeInput: function (e) {
    this.setData({
      rechargeMoney: e.detail.value
    })
  },
  submitOrder(){
    if (this.data.rechargeOrder == '01') {
      if (this.data.rechargeMoney > 500000) {
        return app.showErrorModal('充值金额不高于50万元');
      } else if (re.test(this.data.rechargeMoney) && this.data.rechargeMoney != "") {
        this.rechargeApply();
      } else {
        return app.showErrorModal('请输入正确的金额')
      }
    } else if (this.data.rechargeOrder == '02') {
      if (this.data.rechargeMoney == "") {
        return app.showErrorModal('请输入正确的金额')
      } else if (re2000.test(this.data.rechargeMoney) && this.data.rechargeMoney % 2000 === 0 && this.data.rechargeMoney != "") {
        this.rechargeApply();
      } else {
        return app.showErrorModal('请确保充值金额是2000或2000的整数倍')
      }
    }
  },
  rechargeApply () {
    api.rechargeApply({
      userId: app.getUserId(),
      rechargeType: this.data.rechargeOrder,
      rechargeMoney: this.data.rechargeMoney
    }).then(data => {
      wx.redirectTo({
        url: `/pages/wxPay/wxPay?rechargeOrderId=${data}&rechargeMoney=${this.data.rechargeMoney}&rechargeType=${this.data.rechargeOrder}`
      })
    })
  },
  onLoad: function (options) {
    if (options.rechargeType) {
      this.setData({
        rechargeOrder: options.rechargeType
      })
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
  // onShareAppMessage: function () {

  // }
})