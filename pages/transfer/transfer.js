const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transferType: '02',
    price: '',
    disabled: false
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  // 改变头部
  changeType (e) {
    this.setData({
      transferType: e.currentTarget.dataset.type
    })
  },
  // 输入的金额
  setMoney (e) {
    this.setData({
      price: e.detail.value
    })
  },
  // 确定提交
  confirm () {
    if (this.data.disabled) return;
    this.setData({
      disabled: true
    })
    if (this.data.price % 2000 == 0) {
      api.transfer({
        userId: app.getUserId(),
        money: this.data.price,
        tradeType: this.data.transferType
      }).then(data => {
        this.setData({
          disabled: false
        })
        wx.navigateBack({
          delta: 1
        })
      }).catch(err => {
        this.setData({
          disabled: false
        })
      })
    } else {
      app.showErrorModal('请确保转账金额是2000或2000的整数倍');
      this.setData({
        disabled: false
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