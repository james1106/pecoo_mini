const app = getApp()
const api = require('../../utils/api.js')
const utilMd5 = require('../../utils/md5.js')
const regMobile = /^[1][0-9]{10}$/ // 手机号的正则验证
const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/ // 密码的正则
Page({
  data: {
    baseImg: app.globalData.baseImageUrl,
    username: '', // 手机号
    picCodeVal: '', // 图形验证码
    verificationCodeTemp: '', // 图形验证码key 
    password: '', // 密码
    msgCode: '', // 短信验证码
    msgHtml: '获取短信验证码',
    curTime: 60,
    disabled: false,
    selected: 0,
    isPwd: true, // 密码是否能查看
    isMobile: false, // 是否显示注册
    picCode: '', // 图形验证码链接
    wxOpenId:'',
    shareCode: '', // 推荐码
    back: '', // 回退2页面
    hideBtn: true,
    control: false // 防止二次注册/登录
  },
  onLoad: function (options) {
    if (options.shareCode) {
      this.setData({
        shareCode: options.shareCode
      })
    } else {
      this.setData({
        shareCode: wx.getStorageSync('shareCode') || ''
      })
    }
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
    let wxInfo = wx.getStorageSync('wxInfo');
    if (wxInfo) {
      this.setData({
        hideBtn: false
      })
    }
  },
  /**
   * 改变tab
   */
  changeAccountHead (e) {
    let selected = e.currentTarget.dataset.selected * 1
    if (this.data.selected == selected) return
    this.setData({
      selected: selected
    })
  },
  /**
   * 显示/隐藏密码
   */
  showPwd () {
    this.setData({
      isPwd: !this.data.isPwd
    })
  },
  /**
   * 针对手机号的校验
   */
  regMobile (mobile) {
    if (!mobile) {
      app.showErrorModal('请输入手机号')
      return false
    } else if (!regMobile.test(mobile)) {
      app.showErrorModal('请输入正确的手机号')
      return false
    } else {
      return true
    }
  },
  /**
   * 登录
   */
  loginIn (e) {
    let userInfoObj = e.detail.value
    if (this.regMobile(userInfoObj.username)) {
      if (userInfoObj.password == '') {
        return app.showErrorModal('请输入密码');
      } else {
        if (!this.data.control) {
          wx.showLoading({
            title: '加载中...'
          })
          this.setData({
            control: true
          })
          api.loginIn({
            userId: app.getUserId(),
            mobile: userInfoObj.username,
            pwd: utilMd5.hexMD5(userInfoObj.password)
          }).then(data => {
            if (data != null) {
              this.saveUserInfo(data)
              wx.hideLoading()
              app.showToast('登录成功', 'success', this.goPages.bind(this));
              this.setData({
                control: false
              })
            }
          }).catch(err => {
            wx.hideLoading()
            this.setData({
              control: false
            })
          })
        }
      }
    } else {
      return app.showErrorModal('请输入正确的手机号');
    }
  },
  /**
   * 校验手机号是否存在
   */
  checkMobile () {
    if (this.regMobile(this.data.username)) {
      api.verificationMobile({
        userId: app.getUserId(),
        mobile: this.data.username
      }).then(data => {
        if (data === 'exist') {
          this.setData({
            selected: 1
          })
        } else {
          this.setData({
            isMobile: true
          })
          this.getPicVerificationCode()
        }
      })
    }
  },
  success(data) {
    let wxInfo = {}
    wxInfo.nickName = data.nickName
    wxInfo.picAddress = data.avatarUrl
    wxInfo.openId = data.openid
    wx.setStorageSync('wxInfo', wxInfo);
  },
  failed(err) {
    return false
  },
  getUserInfoAction: function () {
    this.setData({
      hideBtn: false
    })
    app.getUserInfo(this.success.bind(this), this.failed.bind(this))
  },
  /**
   * 注册页手机号
   */
  mobileInputHandle (e) {
    this.setData({
      username: e.detail.value
    })
  },
  changeMsgCode (e) {
    this.setData({
      msgCode: e.detail.value
    })
  },
  /**
   * 获取图形验证码的code值
   */
  getPicVerificationCode () {
    api.picVerificationKey({ userId: app.globalData.userId}).then(data => {
      let picCode = `${api.picVerificationCodeUrl}?verificationCodeTemp=${data}&n=${Math.floor(Math.random() * (99) + 1)}`
      this.setData({
        picCode: picCode,
        verificationCodeTemp: data        
      })
    })
  },
  /**
   * 改变图形验证码的code值
   */
  changePicCode () {
    this.getPicVerificationCode()
  },
  shareCodeInputHandle (e) {
    this.setData({
      shareCode: e.detail.value
    })
  },
  /**
   * 图形验证码blur事件
   */
  picCodeInputHandle (e) {
    this.setData({
      picCodeVal: e.detail.value
    })
  },
  /**
   * 获取短信验证码
   */
  getMsgCode () {
    if (!this.data.picCodeVal) {
      app.showErrorModal('请输入图形验证码');
    } else if (this.data.disabled) {
      return false
    }
    api.getRegisterCode({
      userId: app.getUserId(),
      mobile: this.data.username,
      picCode: this.data.picCodeVal,
      verificationCodeTemp: this.data.verificationCodeTemp,
      reset: '1'
    }).then(data => {
      this.setData({
        msgCode: data,
        msgHtml: this.data.curTime + 'S',
        disabled: true
      })
      this.changeMsgHtml()
    }).catch(err => {
      this.getPicVerificationCode()
    })
  },
  /**
   * 改变短信验证码内容
   */
  changeMsgHtml () {
    let that = this;  
    let curTime = that.data.curTime;
    let timer = null;
    timer = setInterval(function () {
      curTime --
      that.setData({
        msgHtml: curTime + 'S'
      })
      if (curTime <= 0) {
        clearInterval(timer)
        that.setData({
          msgHtml: '重新获取验证码',
          disabled: false
        })
      }
    }, 1000)
  },
  /**
   * 密码blur事件
   */
  pwdInputHandle (e) {
    this.setData({
      password: e.detail.value
    })
  },
  /**
   * 清除密码
   */
  claerPassword () {
    this.setData({
      password: ''
    })
  },
  /**
   * 保存用户信息在本地
   */
  saveUserInfo (obj) {
    let userInfo = {}
    userInfo.tokenId = obj.tokenId // token
    userInfo.realName = obj.realName // 真实姓名
    userInfo.idCard = obj.idCard // 身份证
    userInfo.userId = obj.id // 用户id
    userInfo.userName = obj.userName // 用户昵称
    userInfo.mobile = obj.mobile // 手机号
    userInfo.isCertificated = obj.isCertificated // 是否认证
    userInfo.buyStatus = obj.taskBuy // 是否是首单购买
    userInfo.shareCode = obj.shareCode // 推荐码
    userInfo.isChannel = obj.isChannel // 渠道
    wx.setStorageSync('userInfo', userInfo)
  },
  /**
   * 注册
   */
  regFormSubmit (e) {
    if (!this.data.username) {
      return app.showErrorModal('请输入手机号');
    } else if (!regMobile.test(this.data.username)) {
      return app.showErrorModal('请输入正确的手机号');
    }else if (!this.data.picCodeVal) {
      return app.showErrorModal('请输入图形验证码');
    } else if (!this.data.msgCode) {
      return app.showErrorModal('请输入短信验证码');
    } else if (!this.data.password) {
      return app.showErrorModal('请输入密码');
    } else if (!regPwd.test(this.data.password)) {
      return app.showErrorModal('请输入正确的密码(8~20位字母、数字)')
    }
    if (!this.data.control) {
      this.setData({
        control: true
      })
      wx.showLoading({
        title: '加载中...'
      })
      let regObj = e.detail.value
      api.register({
        mobile: regObj.username,
        pwd: utilMd5.hexMD5(regObj.password),
        messageCode: regObj.msgCode,
        regCode: this.data.shareCode || (app.getShareCode() || '')
      }).then(data => {
        if (data) {
          this.saveUserInfo(data);
          wx.hideLoading()
          app.showToast('注册成功', 'success', this.goPages.bind(this));
          this.setData({
            control: false
          })
        }
      }).catch(err => {
        wx.hideLoading()
        this.setData({
          control: false
        })
      })
    }
  },
  goPages() {
    if (this.data.back) {
      setTimeout(() => {
        wx.navigateBack({
          delta: this.data.back * 1
        })
      }, 1000)
    } else {
      let pages = getCurrentPages();
      if (pages.length == 1) { // 此判断代表当用户分享给用户取登录页面的时候，登录成功后，历史记录没有直接跳转首页
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    }
  },
  onShow:function () {
    let wxInfo = wx.getStorageSync('wxInfo') || '';
    if (wxInfo) {
      this.setData({
        wxOpenId: wxInfo.openId
      })
    }
  },
})

