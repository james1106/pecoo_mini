const app = getApp()
const api = require('../../utils/api.js');
const regMobile = /^[1][0-9]{10}$/ // 手机号的正则验证
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: '获取验证码',
    disabled: false,
    mobile: '', // 手机号
    code: '', // 验证码
    curTime: 60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  setMobile (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  setCode (e) {
    this.setData({
      code: e.detail.value
    })
  },

  getCode () {
    if (!regMobile.test(this.data.mobile)) {
      return app.showErrorModal('请输入正确的手机号');
    } else if (!this.data.mobile) {
      return app.showErrorModal('请输入您的手机号');
    } else {
      if (this.data.disabled) return false;
      api.sendCodeMobileNew({
        mobile: this.data.mobile,
        userId: app.getUserId(),
      }).then(data => {
        this.setData({
          html: this.data.curTime + 'S',
          disabled: true
        })
        this.changeMsgHtml()
      })
    }
  },

  changeMsgHtml() {
    let that = this;
    let curTime = that.data.curTime;
    let timer = null;
    timer = setInterval(function () {
      curTime--
      that.setData({
        html: curTime + 'S'
      })
      if (curTime <= 0) {
        clearInterval(timer)
        that.setData({
          html: '重新获取',
          disabled: false
        })
      }
    }, 1000)
  },


  confirmReivce () {
    if (!regMobile.test(this.data.mobile)) {
      return app.showErrorModal('请输入您的手机号');
    } else if (!this.data.mobile) {
      return app.showErrorModal('请输入您的手机号');
    } else if (!this.data.code) {
      return app.showErrorModal('请输入短信验证码');
    } else {
      api.updateMobile({
        mobile: this.data.mobile,
        messageCode: this.data.code,
        userId: app.getUserId()
      }).then(data => {
        app.showToast('手机号修改成功', 'success', function () {
          wx.removeStorageSync('userInfo');
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 500)
        }.bind(this));
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
  onShareAppMessage: function () {
  
  }
})