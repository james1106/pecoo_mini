var app = getApp();
const api = require('../../utils/api.js')
import drawQrcode from '../../utils/weapp.qrcode.min.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    isChannel: '',
    shareFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isChannel: wx.getStorageSync('userInfo').isChannel || ''
    })
    api.getRecommendCode({
      userId: app.getUserId(),
    }).then(data => {
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: 'https://h5.pecoo.com/pecoo_pay/recommend.html?regCode=' + data.shareCode
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  share () {
    this.setData({
      shareFlag: !this.data.shareFlag
    })
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
    return {
      title: '分享给好友，一起来捡漏',
      desc: '欢迎注册拍库，跨境拍卖第一平台，聚集全球拍卖，就等您来捡漏!',
      imageUrl: 'https://static.pecoo.com/images/common/share_logo.png',
      path: `/pages/login/login?shareCode=${app.getShareCode()}`
    }
  }
})
