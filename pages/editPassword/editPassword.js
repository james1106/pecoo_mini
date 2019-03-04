var app = getApp();
const api = require('../../utils/api.js');
const utilMd5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tokenId:'',
    userName:'',
    oldpassword:'',
    newpassword1:'',
    newpassword2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  oldPwd (e) {
    this.setData({
      oldpassword: e.detail.value
    })
  },
  newPwd (e) {
    this.setData({
      newpassword1: e.detail.value
    })
  },
  confirmPwd (e) {
    this.setData({
      newpassword2: e.detail.value
    })
  },
  // 密码的正则需要修改
  changePassword() {
    const rulePwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    if (this.data.oldpassword == "") {
      return app.showErrorModal("密码不能为空！");
    }
    if (this.data.newpassword1 == "") {
      return app.showErrorModal("新密码不能为空！");
    }
    if (this.data.newpassword2 == "") {
      return app.showErrorModal("确认密码不能为空！");
    }
    if (!rulePwd.test(this.data.newpassword1)) {
      return app.showErrorModal("请输入正确的新密码(8~20位字母、数字)");
    }
    if (!rulePwd.test(this.data.newpassword2)) {
      return app.showErrorModal("请输入正确的密码(8~20位字母、数字)");
    }
    if (this.data.newpassword1 != this.data.newpassword2) {
      return app.showErrorModal("两次密码输入不一致！");
    }	
    api.changePassword({
      userId: app.getUserId(),
      mobile: wx.getStorageSync('userInfo').mobile,
      oldPwd: utilMd5.hexMD5(this.data.oldpassword),
      pwd: utilMd5.hexMD5(this.data.newpassword1)
    }).then(data => {
      app.showToast('修改密码成功', 'none', () => {
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('shareCode');
        setTimeout( () => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 1000)
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userName: wx.getStorageSync('userInfo').userName
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
  // onShareAppMessage: function () {
  
  // }
})