const app = getApp();
const api = require('../../utils/api.js');
const colleType = '01';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,     
    auctionId: '', // 当前拍卖会的id
    auctionHouse: {}, // 拍卖会的数据
    loading: false,
    goodsList:[], // 会场列表数据
    shareCode: '', // 推荐码
    pageNum: 1,
    totalCount: 0,
    height: 0,
    baseImg: app.globalData.baseImageUrl,
    isShare: '',
    appParams: '' // 传递app的参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isShare) {
      wx.removeStorageSync('shareCode');
    }
    if (options.shareCode) {
      this.setData({
        shareCode: options.shareCode
      })
      wx.setStorageSync('shareCode', options.shareCode);
    }
    let appParams = `{"page": "saleList", "pkId":"${options.id}"}`
    api.auctionListGoods({
      userId: app.getUserId(),
      auctionId: options.id,
      pageNum: 1,
      pageSize: 10
    }).then(data => {
      this.setData({
        appParams: appParams,
        isShare: options.isShare || '',
        auctionHouse: data,
        goodsList: data.goodsList,
        auctionId: options.id,
        totalCount: data.totalCount,
        hidden: true
      })
    })
  },
  onReachBottom: function () {
    if (this.data.goodsList.length >= this.data.totalCount) return;
    this.setData({
      loading: true
    })
    api.auctionListGoods({
      userId: app.getUserId(),
      auctionId: this.data.auctionId,
      pageNum: ++this.data.pageNum,
      pageSize: 10
    }).then(data => {
      this.setData({
        pageNum: data.pageNo,
        goodsList: this.data.goodsList.concat(data.goodsList),
        loading: false
      })
    })
  },
  setCollection() {
    api.addUserCollection({
      'goodsId': this.data.auctionId,
      'userId': app.getUserId(),
      'colleType': colleType
    }).then(data => {
      let auctionHouse = this.data.auctionHouse
      auctionHouse.isCol = 'Y'
      this.setData({
        auctionHouse: auctionHouse
      })
      app.showToast('收藏成功');
    })
  },
  cancelCollection () {
    api.delUserCollection({
      goodsIds: this.data.auctionId,
      userId: app.getUserId(),
      colleType: colleType
    }).then(data => {
      let auctionHouse = this.data.auctionHouse
      auctionHouse.isCol = 'N'
      this.setData({
        auctionHouse: auctionHouse
      })
      app.showToast('已取消收藏');
    })
  },
  
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return{
      title: this.data.auctionHouse.name,
      path: `/pages/saleList/saleList?id=${that.data.auctionId}&shareCode=${app.getShareCode()}`
    }
  }
})