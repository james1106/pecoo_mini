const api = require('../../utils/api.js');
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    idNo: '',
    smsCode: '',
    curTime: 60,
    msgHtml: '获取验证码',
    disabled: false,
    isCertificated: '',
    back: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
    api.myUsreInfo({
      id: app.getUserId()
    }).then(data => {
      this.setData({
        isCertificated: data.isCertificated || '',
        userName: data.realName ? (data.realName.length >= 3 ? '**' + data.realName.substr(2) : '*' + data.realName.substr(1)) : '',
        idNo: data.idCard ? data.idCard.substr(0, 3) + '***********' + data.idCard.substr(14) : ''
      })
    })
  },

  changeName (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  changeCard (e) {
    this.setData({
      idNo: e.detail.value
    })
  },

  changeCode (e) {
    this.setData({
      smsCode: e.detail.value
    })
  },

  getCode () {
    if (!this.data.userName) {
      return app.showErrorModal('请输入您的姓名！');
    } else if (!this.data.idNo) {
      return app.showErrorModal('请输入您的身份证号！');
    }
    if (!this.data.disabled) {
      api.sendMobileReal({
        sourceMode: app.globalData.sourceMode,
        mobile: wx.getStorageSync('userInfo').mobile
      }).then(data => {
        this.setData({
          smsCode: data,
          msgHtml: this.data.curTime + 'S',
          disabled: true
        })
        let curTime = this.data.curTime;          
        let timer = setInterval(function () {
          curTime--;
          if (curTime == 0) {
            this.setData({
              msgHtml: '重新获取',
              disabled: false
            })
            clearInterval(timer)
          } else {
            this.setData({
              msgHtml: curTime + 'S'
            })
          }
        }.bind(this), 1000) 
      })
    }
  },

  confirmSubmit () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!this.data.userName) {
      return app.showErrorModal('请输入您的姓名！');
    } else if (!this.data.idNo) {
      return app.showErrorModal('请输入您的身份证号！');
    } else if (!this.data.smsCode) {
      return app.showErrorModal('请输入短信验证码');
    }
    api.userVerify({
      userId: userInfo.userId,
      idNo: this.data.idNo,
      userName: this.data.userName,
      mobile: userInfo.mobile,
      smsCode: this.data.smsCode
    }).then(data => {
      userInfo.isCertificated = 'Y';
      userInfo.realName = this.data.userName;
      userInfo.idCard = this.data.idNo;
      wx.setStorageSync('userInfo', userInfo);
      app.showToast('实名认证成功', 'success', function () {
        if (that.data.back) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.changeCertificated()
        }
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      })
    }).catch( err => {
      app.showToast(err.data.msg)
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