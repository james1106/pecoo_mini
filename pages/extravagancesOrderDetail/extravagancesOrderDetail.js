var app = getApp();
const api = require('../../utils/api.js')
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    baseImg: app.globalData.baseImageUrl,
    curOrderDetail:{},
    hide: false, // 倒计时隐藏
    disable: false, // 二次点击订单
    time: '', // 倒计时时间
    processData: [
      {
        currentNode: '00',
        name: '已下单'
      },
      {
        currentNode: '01',
        name: '已支付'
      },
      {
        currentNode: '15',
        name: '已发货'
      },
      {
        currentNode: '30',
        name: '已完成'
      }
    ],
    currentProcess: 0,
  },
  callme: function () {
    wx.makePhoneCall({
      phoneNumber: '4001112016',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
  },
  goDetail () {
    wx.navigateTo({
      url: '/pages/extravagancesDetail/extravagancesDetail?id=' + this.data.curOrderDetail.goodsId,
    })
  },
  /**
   * 获取数据
   */
  getLuxuryOrderDetail () {
    let hide = false;
    api.luxuryOrderDetail({
      orderId: this.data.orderId,
      userId: app.getUserId(),
    }).then(data => {
      if (data.orderState != 94 && data.orderState != 92 && data.orderState != 90) {
        let currentProcess = this.data.currentProcess
        switch (data.orderState) {
          case '00':
            currentProcess = 0;
            break;
          case '00':
            currentProcess = 0;
            break;
          case '10':
            currentProcess = 1;
            break;
          case '15':
            currentProcess = 2;
            break;
          case '30':
            currentProcess = 3;
            break;
        }
        this.setData({
          currentProcess: currentProcess
        })
        hide = false
      } else {
        let processData = [
          {
            name: '已下单'
          },
          {
            name: '已取消'
          }
        ]
        this.setData({
          processData: processData,
          currentProcess: 1
        })
      }
      if (data.orderState == '00') {
        this.autoPlay(data.residualPaymentTime);
        hide = false
      } else {
        clearInterval(timer)
        hide = true
      }
      data.goodsPrice = app.toDecimal2(data.goodsPrice);
      data.priceFreight = app.toDecimal2(data.priceFreight);
      data.priceTotal = app.toDecimal2(data.priceTotal);
      this.setData({
        curOrderDetail: data,
        residualPaymentTime: data.residualPaymentTime,
        hidden: true,
        disable: false,
        hide: hide
      })
    })
  },
  /**
   * 定时器每一秒走一次
   */
  autoPlay (time) {
    timer = setInterval( () => {
      time--;
      if (time * 1 <= 0) {
        clearInterval(timer);
        this.setData({
          hide: true
        })
      }
      this.countdown(time);
    }, 1000)
  },
  /**
   * 倒计时换算 
   */
  countdown (time) {
    let secondTime = parseInt(time); // 秒
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime > 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    let result = "" + parseInt(secondTime) + "秒";
    if (minuteTime > 0) {
      result = "" + parseInt(minuteTime) + "分" + result;
    } else {
      result = "0分" + result;
    }
    if (hourTime > 0) {
      result = "" + parseInt(hourTime) + "小时" + result;
    } else {
      result = "0小时" + result;
    }
    this.setData({
      time: result
    })
  },
  // 去支付
  pay () {
    wx.navigateTo({
      url: `/pages/orderPay/orderPay?orderId=${this.data.orderId}`,
    })
  },
  // 取消订单
  cancel () {
    let that = this;
    app.showModal('您确定要取消订单吗？', function () {
      if (this.data.disable) return;
      this.setData({
        disable: true
      })
      api.luxuryOrderCancel({
        orderId: this.data.orderId,
        userId: app.getUserId()
      }).then(data => {
        app.showToast('取消订单成功', 'success', function () {
          that.getLuxuryOrderDetail();
          that.setData({
            hide: true
          })
        })
      })
    }.bind(this), function () {
      console.log('取消取消订单')
    }.bind(this))
  },
  // 上传身份证
  uploadIdCard () {
    wx.navigateTo({
      url: `/pages/credentials/credentials?receiveName=${this.data.curOrderDetail.receiveName}&orderId=${this.data.curOrderDetail.orderNo}&cardId=${this.data.curOrderDetail.cardId}`,
    })
  },
  // 查看物流
  lookExpress (e) {
    wx.navigateTo({
      url: `/pages/lookExpress/lookExpress?orderId=${this.data.orderId}&type=luxury`,
    })
    // let content = '运单号：' + this.data.curOrderDetail.expressNo + '\r\n物流公司：' + this.data.curOrderDetail.expressCompany;
    // app.showErrorModal(content, '物流信息')
  },
  // 绑定清关证件
  bindIdCard () {
    this.getLuxuryOrderDetail();
    wx.navigateBack({
      delta: 1
    })
    app.showToast('绑定证件成功', 'success')
  },
  // 联系客服
  callMe () {
    wx.makePhoneCall({
      phoneNumber: '4001112016',
    })
  },
  // 提醒发货
  remind () {
    setTimeout(() => {
      app.showToast('提醒发货成功', 'success')
    }, 200)
  },
  // 确认收货
  confirmGoods () {
    let that = this;
    api.luxuryConfirmGoods({
      orderId: this.data.orderId,
      userId: app.getUserId()
    }).then(data => {
      app.showToast('确认收货成功', 'success', function () {
        that.getLuxuryOrderDetail();
      })
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
    this.getLuxuryOrderDetail()
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
    clearInterval(timer)
  },

})