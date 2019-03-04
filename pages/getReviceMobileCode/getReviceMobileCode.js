const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '', // 当前登陆手机号
    html: '获取验证码',
    curTime: 60,
    disabled: false,
    code: '' // 验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        mobile: userInfo.mobile
      })
    }
  },

  setCode (e) {
    this.setData({
      code: e.detail.value
    })
  },

  
  getCode () {
    if (this.data.disabled) return false;
    api.sendCodeMobileOld({
      mobile: this.data.mobile,
      userId: app.getUserId(),
    }).then(data => {
      this.setData({
        html: this.data.curTime + 'S',
        disabled: true
      })
      this.changeMsgHtml()
    })
  },


  changeMsgHtml () {
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


  next () {
    if (!this.data.code) {
      app.showErrorModal('请输入短信验证码！')
    } else {
      api.isCodeOld({
        mobile: this.data.mobile,
        messageCode: this.data.code
      }).then(data => {
        wx.redirectTo({
          url: '/pages/reviceMobile/reviceMobile',
        })
      })
    }
  },


  notRecive () {
    wx.showModal({
      content: '若您的原手机号无法接受验证码，请致电400-1112-016修改',
      confirmText: '呼叫',
      cancelText: '取消',
      cancelColor: '#999999',
      confirmColor: '#999999',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-1112-016'
          })
        }
      },
      fail: function () {
        console.log('fail')
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})