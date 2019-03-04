// pages/newTask/newTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyStatus: '',
    taskCertificated: '',
    userName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: options.userName,
      buyStatus: options.buyStatus,
      taskCertificated: options.taskCertificated
    })
  },
  changeCertificated () {
    this.setData({
      taskCertificated: 'Y'
    })
  },
  goRealName () {
    if (this.data.userName) {
      wx.navigateTo({
        url: '/pages/realName/realName?back=1',
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login?back=2',
      })
    }
  },
  goLogin () {
    wx.redirectTo({
      url: '/pages/login/login?back=2',
    })
  },
  goBuy () {
    if (this.data.userName) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login?back=2',
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
  
  }
})