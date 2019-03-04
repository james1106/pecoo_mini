var app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    isCertificated: null, // 是否实名认证
    buyStatus: '', // 是否首单购买
    realName: '', // 真实姓名
    userName: '', // 用户名
    isChannel:'', // 渠道
    taskCertificated: '', // 是否实名认证任务
    wxNickName:'拍库',
    versionNewStatus: '', // 是否是新用户
    taskSurplusDays: '', // 是否过期
    msgCount: 0,
    wxHeadImage: '', // 头像
    process: [ // 流程 eg:待发货
      {
        url: '/pages/myOrder/myOrder?status=3',
        image: 'mine/pedding_payment.png',
        name: '待付款',
        width: '45rpx',
        height: '38rpx',
        isLogin: true
      },
      {
        url: '/pages/myOrder/myOrder?status=4',
        image: 'mine/pedding_delivery.png',
        name: '待发货',
        width: '44rpx',
        height: '42rpx',
        isLogin: true
      },
      {
        url: '/pages/myOrder/myOrder?status=5',
        image: 'mine/pedding_goods.png',
        name: '待收货',
        width: '43rpx',
        height: '42rpx',
        isLogin: true
      },
      {
        url: '/pages/myOrder/myOrder?status=6',
        image: 'mine/complete.png',
        name: '已完成',
        width: '50rpx',
        height: '50rpx',
        isLogin: true
      }
    ],
    myFn: [
      {
        url: '/pages/myCollect/myCollect',
        image: 'mine/my_collection_yellow.png',
        name: '我的收藏',
        width: '70rpx',
        height: '70rpx',
        isLogin: true
      },
      {
        url: '/pages/voucher/voucher',
        image: 'mine/coupon_yellow.png',
        width: '70rpx',
        height: '70rpx',
        name: '优惠券',
        isLogin: true
      },
      {
        url: '/pages/myWallet/myWallet',
        image: 'mine/wallet_yellow.png',
        name: '我的钱包',
        width: '70rpx',
        height: '70rpx',
        isLogin: true
      },
      {
        url: '/pages/goldShop/goldShop',
        image: 'mine/gold_yellow.png',
        name: '金币商城',
        width: '70rpx',
        height: '70rpx',
        isLogin: false
      },
      {
        url: '/pages/myReferrer/myReferrer',
        image: 'mine/qr_code_yellow.png',
        name: '我的推荐',
        width: '70rpx',
        height: '70rpx',
        isLogin: true
      },
      {
        url: '/pages/set/set',
        image: 'mine/set_yellow.png',
        name: '设置',
        width: '70rpx',
        height: '70rpx',
        isLogin: false
      }
    ],
    isRequestCompleted: false // 为了保证onShow里面的数据全部拿取到
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let userId = app.getUserId();
    let that = this;
    if (userId) {
      let myUserInfo = api.myUsreInfo({
        id: userId
      }).then(data => {
        return data
      })
      let messageCount = api.queryMessageListCount({
        userId: userId
      }).then(data => {
        return data
      })
      Promise.all([myUserInfo, messageCount]).then(function (data) {
        let userInfo = wx.getStorageSync('userInfo');
        userInfo.userName = data[0].userName;
        userInfo.realName = data[0].realName;
        userInfo.userImage = data[0].headImage;
        userInfo.isCertificated = data[0].isCertificated;
        userInfo.buyStatus = data[0].taskBuy;
        userInfo.isChannel = data[0].isChannel;
        wx.setStorageSync('userInfo', userInfo);
        that.setData({
          userName: userInfo.userName,
          realName: userInfo.realName,
          userImage: userInfo.userImage || that.data.baseImg+'common/logo.png',
          isCertificated: userInfo.isCertificated,
          buyStatus: userInfo.buyStatus,
          msgCount: data[1],
          taskCertificated: data[0].taskCertificated,
          versionNewStatus: data[0].versionNewStatus,
          isRequestCompleted: true
        })
      })
    } else {
      this.setData({
        userName: '',
        realName: '',
        userImage: this.data.baseImg + 'common/logo.png',
        isCertificated: '',
        taskCertificated: '',
        versionNewStatus: 'Y',
        buyStatus: '',
        msgCount: 0,
        isRequestCompleted: true
      })
    }
  },
  // 打电话
  callme () {
    wx.makePhoneCall({
      phoneNumber: '4001112016',
    })
  },
  // 去新手任务
  goNewTask () {
    wx.navigateTo({
      url: `/pages/newTask/newTask?userName=${this.data.userName}&taskCertificated=${this.data.taskCertificated}&buyStatus=${this.data.buyStatus}`,
    })
  },
  jumpPage (url) {
    if (this.data.isRequestCompleted) {
      if (this.data.userName) {
        wx.navigateTo({
          url: url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    }
  },
  // 我得消息
  goMyLetters (e) {
    this.jumpPage('/pages/myLetter/myLetter')
  },
  goOrder () {
    this.jumpPage('/pages/myOrder/myOrder')
  },
  goPages (e) {
    let obj = e.currentTarget.dataset;
    if (obj.islogin && this.data.isRequestCompleted && !this.data.userName) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: obj.url,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
})