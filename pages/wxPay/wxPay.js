var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeType: '', // 充值类型
    rechargeMoney: '', // 金额
    rechargeOrderId: '', // 充值订单id
    disable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rechargeType: options.rechargeType,
      rechargeMoney: options.rechargeMoney,
      rechargeOrderId: options.rechargeOrderId
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

  pay () {
    if (this.data.disable) return;
    this.setData({
      disable: true
    })
    let that = this;
    let openId = wx.getStorageSync('wxInfo') && wx.getStorageSync('wxInfo').openId;
    openId && api.rechargePay({
      rechargeWay: '03',
      rechargeOrderId: this.data.rechargeOrderId,
      openId: openId
    }).then(data => {
      let wxPayInfo = JSON.parse(data.wxpayinfo);
      wx.requestPayment({
        'timeStamp': wxPayInfo.timestamp,
        'nonceStr': wxPayInfo.noncestr,
        'package': wxPayInfo.package,
        'signType': wxPayInfo.signType,
        'paySign': wxPayInfo.finalsign,
        'success': function (res) {
          wx.navigateBack({
            delta: 1
          })
        },
        'fail': function () {
          that.setData({
            disable: false
          })
        }
      })
    })
  }
})