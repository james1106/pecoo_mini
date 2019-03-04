var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  registerUserName (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  sendVerificationCode(){
    if (this.data.mobile.length==11){
      api.verificationMobile({
        mobile: this.data.mobile,
        userId: app.getUserId(),
      }).then(data => {
        if (data == 'no_exist') {
          return app.showErrorModal('该手机号未注册');
        } else {
          wx.navigateTo({
            url: `/pages/backPasswordNext/backPasswordNext?mobile=${this.data.mobile}`,
          })
        }
      })
    }else{
      return app.showErrorModal('请输入正确手机号码！');
    }
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