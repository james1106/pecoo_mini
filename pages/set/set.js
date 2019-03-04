var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    userId: '',
    setData: [
      {
        url: '/pages/address/address',
        name: '地址管理',
        isLogin: true
      },
      {
        url: '/pages/getReviceMobileCode/getReviceMobileCode',
        name: '修改手机号',
        isLogin: true
      },
      {
        url: '/pages/editPassword/editPassword',
        name: '修改登录密码',
        isLogin: true
      },
      {
        url: '/pages/realName/realName',
        name: '实名认证',
        isLogin: true
      },
      {
        url: '/pages/credentials/credentials',
        name: '清关证件',
        isLogin: true
      },
      {
        url: '/pages/aboutUs/aboutUs',
        name: '关于我们',
        isLogin: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = app.getUserId();
    if (userId) {
      this.setData({
        userId: userId
      })
    }
  },
  //退出登录
  logout(){
    wx.showModal({
      title: '提示',
      content: '确定退出当前账户？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('shareCode');
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    }) 
  },
  goPages (e) {
    let obj = e.currentTarget.dataset;
    if (obj.islogin) {
      if (this.data.userId) {
        wx.navigateTo({
          url: obj.url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    } else {
      wx.navigateTo({
        url: obj.url
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
  // onShareAppMessage: function () {

  // }
})