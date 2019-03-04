const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    curOrderDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getAuctionOrderDetail({
      orderId: options.orderId,
      userId: app.getUserId()
    }).then(data => {
      data.transPrice = app.toDecimal2(data.transPrice);
      data.totalNopremiumRmb = app.toDecimal2(data.totalNopremiumRmb);
      data.goodsAmount = app.toDecimal2(data.goodsAmount);
      data.goodsAmountRmb = app.toDecimal2(data.goodsAmountRmb);
      data.commission = app.toDecimal2(data.commission);
      data.serviceFee = app.toDecimal2(data.serviceFee);
      data.totalFreight = app.toDecimal2(data.totalFreight);
      data.totalFreightRmb = app.toDecimal2(data.totalFreightRmb);
      data.freight = app.toDecimal2(data.freight);
      data.pickupFee = app.toDecimal2(data.pickupFee);
      data.packFee = app.toDecimal2(data.packFee);
      data.premiumAmount = app.toDecimal2(data.premiumAmount);
      data.freightServiceFee = app.toDecimal2(data.freightServiceFee);
      if (data.collectGoodsCountdown) {
        data.collectGoodsCountdown = this.diffTime(data.collectGoodsCountdown)
      }
      this.setData({
        curOrderDetail: data,
        hidden: true
      })
    })
  },
  // 计算时间
  diffTime (time) {
    let day = parseInt(time / 3600 / 24)
    let hours = parseInt(time / 3600 - day * 24)
    if (hours <= 0) {
      hours = 1
    }
    return day + '天' + hours + '小时'
  },
  // 联系客服
  callMe () {
    wx.makePhoneCall({
      phoneNumber: '400-1112-016'
    })
  },
  // 申请售后
  afterSales () {
    if (this.data.curOrderDetail.afterSaleStatus == 0) {
      wx.navigateTo({
        url: `/pages/afterSales/afterSales?orderId=${this.data.curOrderDetail.id}&goodsId=${this.data.curOrderDetail.goodsId}`,
      })
    } else {
      app.showErrorModal('您的订单正在审核中')
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