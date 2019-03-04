const app = getApp()
const api = require('../../utils/api.js')
const utilMd5 = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picCodeImg:'',
    userName:'',
    picCode:'',
    messageCode:'',
    password:'',
    verificationCodeTemp:'',
    phoneCode: "获取验证码",
    curTime: 60,
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: options.mobile
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  setPicCode (e) {
    this.setData({
      picCode: e.detail.value
    })
  },
  messageCodeInput (e) {
    this.setData({
      messageCode: e.detail.value
    })
  },
  passwordInput (e) {
    this.setData({
      password: e.detail.value
    })
  },
  validateImg () {
    api.picVerificationKey({
      userId: app.getUserId(),
    }).then(data => {
      let picCode = `${api.picVerificationCodeUrl}?verificationCodeTemp=${data}&n=${Math.floor(Math.random() * (99) + 1)}`
      this.setData({
        picCodeImg: picCode,
        verificationCodeTemp: data
      })
    })
  },
  // 找回密码,获取短信验证码
  verificationCode(){
    if (!this.data.userName) {
      return app.showErrorModal('请输入您的手机号！');
    }
    if (!this.data.picCode) {
      return app.showErrorModal('请输入图片验证码！');
    }
    if (!this.data.disabled) {
      api.getRegisterCode({
        userId: app.getUserId(),
        mobile: this.data.userName,
        picCode: this.data.picCode,
        verificationCodeTemp: this.data.verificationCodeTemp,
        reset: '0'
      }).then(data => {
        this.setData({
          phoneCode: this.data.curTime + 'S',
          disabled: true            
        })
        let curTime = this.data.curTime
        let timer = setInterval(() => {
          curTime--
          this.setData({
            phoneCode: curTime + 'S',
          })
          if (curTime == 0) {
            clearInterval(timer)
            this.setData({
              phoneCode: "重新获取",
              disabled: false
            })
          }
        }, 1000)
      }).catch(err => {
        this.validateImg();
      })
    }
  },
  confirm(){
    if (!this.data.userName) {
      return app.showErrorModal('请输入您的手机号！');
    }
    if (!this.data.picCode) {
      return app.showErrorModal('请输入图片验证码！');
    }
    const rulePwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    if (!this.data.password) {
      return app.showErrorModal('请输入新密码');
    } else if (!rulePwd.test(this.data.password)) {
      return app.showErrorModal('请输入密码(8～20位字母/数字)')
    }
    let pwd = utilMd5.hexMD5(this.data.password);
    api.resetPwd({
      userId: app.getUserId(),
      mobile: this.data.userName,
      pwd: pwd,
      messageCode: this.data.messageCode
    }).then(data => {
      app.showToast('找回密码成功', 'success', function () {
        setTimeout( () => {
          wx.navigateBack({
            delta: 2
          })
        }, 1000)
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.validateImg();
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