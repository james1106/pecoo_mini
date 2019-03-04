var app = getApp();
const api = require('../../utils/api.js')
const acc = require('../../utils/calculate.js')
var detailB = true;
var orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    disable: false,
    curOrderDetail: {}, // 当前支付信息
    fareMoney: '0.00', // 抵付
    payMoney: 0, // 待支付
    wxPay: true, // 微信支付
    balancePay: false, // 余额支付
    paybtn: true, // 防止多次支付
    isInsurance: false // 默认不展示保险费
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.payAuctionInfo({
      orderId: options.orderId,
      userId: app.getUserId()
    }).then(data => {
      data.freightMoney = data.transferStatus == 'N' ? data.realMoney :acc.accSub(data.premiumRmb, data.realMoney) // 运费
      if (data.transferStatus == 'G') {
        data.badMoney = acc.accSub(data.premiumRmb, data.realMoney) // 枚举的属性 表示不购买保险的订单价格
      }
      this.setData({
        curOrderDetail: data,
        payMoney: data.realMoney,
        isInsurance: data.transferStatus == 'G' ? true : false,
        hidden: true
      })
    })
  },
  // 取消保险
  changeInsurance () {
    let that = this
    let curOrderDetail = that.data.curOrderDetail
    if (this.data.isInsurance) {
      wx.showModal({
        title: '提示',
        content: '确定取消为您的货品购买保险',
        confirmText: '再想想',
        cancelText: '确定',
        cancelColor: '#666666',
        confirmColor: '#333333',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) { // ui原因取得相反逻辑
            that.setData({
              isInsurance: false
            })
            that.diffMoney()
          }
        }
      })
    } else {
      that.setData({
        isInsurance: true
      })
      that.diffMoney()
    }
  },
  // 计算金额
  diffMoney () {
    let userMoney = this.data.curOrderDetail.usedMoney; // 可用余额
    // 实际需要支付的订单金额（存在购买保险与不购买保险的情况
    let orderMoney = 0
    if (this.data.isInsurance) { // 表示购买保险
      orderMoney = this.data.curOrderDetail.realMoney
    } else {
      if (this.data.curOrderDetail.transferStatus == 'G') { // 表示订单购买了保险
        orderMoney = this.data.curOrderDetail.badMoney
      } else { // 表示之前订单就没购买保险
        orderMoney = this.data.curOrderDetail.realMoney
      }
    }
    if (this.data.balancePay) { // 余额支付
      if (userMoney >= orderMoney) { // 余额大于订单金额
        this.setData({
          disable: true,
          fareMoney: orderMoney,
          payMoney: '0.00'
        })
      } else { // 余额小于订单金额，需混合支付
        let fareMoney = userMoney // 剩下所有余额
        let payMoney = acc.accSub(fareMoney, orderMoney); // 微信再需支付金额
        this.setData({
          payMoney: payMoney,
          fareMoney: fareMoney ? fareMoney : '0.00',
          disable: false
        })
      }
    } else {
      this.setData({
        disable: false,
        fareMoney: '0.00',
        payMoney: orderMoney
      })
    }
  },
  // 余额
  changeBalancePay () {
    if (!this.data.curOrderDetail.usedMoney) return;
    this.setData({
      balancePay: !this.data.balancePay
    })
    this.diffMoney()
  },
  // 支付
  pay () {
    let that = this;
    if (!this.data.paybtn) return
    this.setData({
      paybtn: false
    })
    api.auctionOrderPay({
      openId: wx.getStorageSync('wxInfo').openId,
      orderId: this.data.curOrderDetail.id,
      userId: app.getUserId(),
      rechargeWay: this.data.balancePay ? (this.data.curOrderDetail.realMoney > this.data.curOrderDetail.usedMoney ? '03' : '04') : '03',
      isBalance: this.data.balancePay ? 'Y' : 'N',
      transferStatus: this.data.isInsurance ? 'G' : 'N',
      payType: '02',
      productQuantity: 1,
      updateAddressId: this.data.curOrderDetail.addressId,
      productName: this.data.curOrderDetail.goodsName, // 商品名称
      productAmount: this.data.curOrderDetail.goodsAmountRmb, // 商品金额
      actualMoney: this.data.payMoney
    }).then(data => {
      that.setData({
        paybtn: true
      })
      if (data.wxpayinfo) {
        let wxPayInfo = JSON.parse(data.wxpayinfo);
        wx.requestPayment({
          'timeStamp': wxPayInfo.timestamp,
          'nonceStr': wxPayInfo.noncestr,
          'package': wxPayInfo.package,
          'signType': wxPayInfo.signType,
          'paySign': wxPayInfo.finalsign,
          'success': function (res) {
            app.showToast("支付成功", 'success', function () {
              wx.navigateBack({
                delta: 1,
              })
            })
          }
        })
      } else {
        app.showToast("支付成功", 'success', function () {  
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        })
      }
    }).catch( err => {
      that.setData({
        paybtn: true
      })
      if (err.data.scode == '800001') {
        app.showModal('您存在未完成的支付信息，点击“重新支付”继续付款，点击“取消”等待支付结果（15分钟）', function () {
          api.updateCancelOrderPay({
            orderId: that.data.curOrderDetail.id
          }).then(data => {
            let curOrderDetail = this.data.curOrderDetail;
            curOrderDetail.usedMoney = data
            that.setData({
              curOrderDetail: curOrderDetail
            })
          })
        }.bind(this), function () {
          wx.navigateBack({
            delta: 1
          })
        }.bind(this), '重新支付')
      } else {
        app.showToast(err.data.msg)
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

})