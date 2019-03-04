const app = getApp()
const api = require('../../utils/api.js');
let clickTime = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    submitBtn: true, // 用户操作+—数量
    disable: false, // 正在提交
    baseImg: app.globalData.baseImageUrl,
    addressAndIdCard: {},
    allAddress: '', // 当前用户的所有收货地址
    allCredentials: [], // 当前用户的证件信息
    sumAmount: 0, // 合计
    goodsRate: '', // 汇率
    totalFreightRmb: 0, // 运费
    curProInfo: {}, // 当前商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let addressAndIdCard = api.getAddressAndIdCard({
      userId: app.getUserId(),
    }).then(data => {
      return data
    })
    let orderPrice = api.getOrderPrice({
      userId: app.getUserId(),
      goodsId: options.id,
      buyNum: options.num,
      goodsColor: options.curColor,
      goodsSize: options.curSize
    }).then(data => {
      return data
    })
    Promise.all([addressAndIdCard, orderPrice]).then(data => {
      this.setData({
        addressAndIdCard: data[0],
        curProInfo: options,
        buyNum: options.num,
        sumAmount: app.toDecimal2(data[1].sumAmount),
        totalFreightRmb: app.toDecimal2(data[1].totalFreightRmb),
        unit: data[1].unit,
        goodsRate: data[1].goodsRate,
        hidden: true
      })
    })
  },
  // 更新地址信息
  changeAddressAndIdCard(obj) {
    let addressAndIdCard = this.data.addressAndIdCard;
    addressAndIdCard.recipientName = obj.recipientName;
    addressAndIdCard.phone = obj.phone;
    addressAndIdCard.province = obj.province;
    addressAndIdCard.area = obj.area;
    addressAndIdCard.city = obj.city;
    addressAndIdCard.detailAddress = obj.detailAddress;
    addressAndIdCard.addressId = obj.id;
    addressAndIdCard.isDefault = obj.isDefault;
    addressAndIdCard.realName = '';
    addressAndIdCard.idCardNum = '';
    addressAndIdCard.userCardId = '';
    addressAndIdCard.realNameClear = '';
    this.setData({
      addressAndIdCard: addressAndIdCard
    })
    console.log(this.data.addressAndIdCard)
    wx.navigateBack({
      delta: 1
    })
  },
  // 更新身份证信息
  changeIdCard (obj) {
    let addressAndIdCard = this.data.addressAndIdCard;
    addressAndIdCard.idCardNum = obj.idCardNum;
    addressAndIdCard.realName = obj.realName;
    addressAndIdCard.realNameClear = obj.realNameClear;
    addressAndIdCard.userCardId = obj.id;
    this.setData({
      addressAndIdCard: addressAndIdCard
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 去地址列表页
  goAddress () {
    wx.navigateTo({
      url: '/pages/address/address?back=1',
    })
  },
  // 接收全部地址
  reviceAlladdress(data) {
    let that = this;
    let flag = data.some(v => {
      return v.id == (that.data.addressAndIdCard.addressId || '')
    })
    if (!flag) {
      if (data.length) {
        let addressAndIdCard = that.data.addressAndIdCard;
        addressAndIdCard.recipientName = data[0].recipientName;
        addressAndIdCard.phone = data[0].phone;
        addressAndIdCard.province = data[0].province;
        addressAndIdCard.area = data[0].area;
        addressAndIdCard.city = data[0].city;
        addressAndIdCard.detailAddress = data[0].detailAddress;
        addressAndIdCard.addressId = data[0].id;
        addressAndIdCard.isDefault = data[0].isDefault;
        addressAndIdCard.realName = '';
        addressAndIdCard.idCardNum = '';
        addressAndIdCard.userCardId = '';
        addressAndIdCard.realNameClear = '';
        that.setData({
          addressAndIdCard: addressAndIdCard
        })
      } else {
        that.setData({
          addressAndIdCard: {}
        })
      }
    }
  },
  // 接受全部证件信息
  reviceCredentials(data) {
    let that = this;
    let flag = data.some(v => {
      return v.id == (that.data.addressAndIdCard.userCardId || '')
    })
    if (!flag) {
      let addressAndIdCard = that.data.addressAndIdCard
      addressAndIdCard.realName = '';
      addressAndIdCard.idCardNum = '';
      addressAndIdCard.userCardId = '';
      addressAndIdCard.realNameClear = '';
      that.setData({
        addressAndIdCard: addressAndIdCard
      })
    }
  },
  getOrderPrice () {
    let curProInfo = this.data.curProInfo;
    api.getOrderPrice({
      userId: app.getUserId(),
      goodsId: curProInfo.id,
      buyNum: curProInfo.num,
      goodsColor: curProInfo.curColor,
      goodsSize: curProInfo.curSize
    }).then(data => {
      this.setData({
        sumAmount: data.sumAmount,
        totalFreightRmb: data.totalFreightRmb,
        unit: data.unit,
        goodsRate: data.goodsRate,
        submitBtn: true
      })
    })
  },
  add () {
    let curProInfo = this.data.curProInfo;
    curProInfo.num++;
    this.setData({
      curProInfo: curProInfo
    })
    if (this.data.submitBtn) {
      this.setData({
        submitBtn: false
      })
      this.getOrderPrice()
    }
  },
  reduce () {
    let curProInfo = this.data.curProInfo;
    if (curProInfo.num <= 1) {
      return app.showToast('已经是最小数量了')
    }
    curProInfo.num--;
    this.setData({
      curProInfo: curProInfo
    })
    if (this.data.submitBtn) {
      this.setData({
        submitBtn: false
      })
      this.getOrderPrice()
    }
  },
  goCard () {
    wx.navigateTo({
      url: `/pages/credentials/credentials?back=1`,
    })
  },
  submit () {
    let curProInfo = this.data.curProInfo;
    let addressAndIdCard = this.data.addressAndIdCard;
    if (!addressAndIdCard.addressId) {
      return app.showToast('请先填写您的收货地址')
    }
    if (addressAndIdCard.realNameClear && addressAndIdCard.recipientName != addressAndIdCard.realNameClear) {
      return app.showToast('收货人姓名必须与清关证件姓名一致');
    }
    wx.showLoading({
      title: '正在提交...',
    })
    api.luxuryCreateOrder({
      userId: app.getUserId(),
      goodsId: curProInfo.id,
      buyNum: curProInfo.num,
      clientPrice: curProInfo.price,
      goodsColor: curProInfo.curColor,
      goodsSize: curProInfo.curSize,
      cardId: this.data.addressAndIdCard.userCardId == null ? '' : this.data.addressAndIdCard.userCardId,
      addressId: this.data.addressAndIdCard.addressId
    }).then(data => {
      if (data.orderId) {
        wx.hideLoading();
        wx.redirectTo({
          url: '/pages/orderPay/orderPay?orderId=' + data.orderId,
        })
      }
    }).catch(err => {
      wx.hideLoading()
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