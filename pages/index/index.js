const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let disX, disY;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerData: [], // 轮播图    
    newAuction: [], // 精品专场
    sixContent: [], // 拍卖取
    recommend: [], // 我的推荐
    scrollShow: false,
    loveList: [], // 猜你喜欢
    messageCount: 0, // 我的消息未读个数
    scrollTop: 0,
    baseImg: app.globalData.baseImageUrl,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  // 获取数据
  getData () {
    let that = this
    let banner = api.appIndexBanner({}).then(data => {
      return data
    })
    let indexData = api.appIndex({}).then(data => {
      return data
    })
    let likeGoods = api.likeGoods({}).then(data => {
      return data
    })
    Promise.all([banner, indexData, likeGoods]).then(function (data) {
      that.setData({
        bannerData: data[0],
        newAuction: data[1].newAuction,
        sixContent: data[1].sixContent,
        recommend: data[1].recommend,
        loveList: data[2]
      })
    })
  },
  searchFocusHander (e) {
    wx.navigateTo({
      url: '/pages/auctionSearch/auctionSearch'
    })
  },
  goMessage () {
    wx.navigateTo({
      url: '/pages/myLetter/myLetter',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  jump (e) {
    let obj = e.currentTarget.dataset;
    app.handleJump(obj.gotourl, obj.gotoid, obj.gototype, obj.gotokind)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userId = app.getUserId(); // 获取我的消息的个数
    if (userId) {
      api.queryMessageListCount({
        userId: userId
      }).then(data => {
        this.setData({
          messageCount: data
        })
      })
    } else {
      this.setData({
        messageCount: 0
      })
    }
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
  // 监听滚动条
  onPageScroll: function (e) {
    if (e.scrollTop > 210) {
      this.setData({
        scrollShow: true
      })
    } else {
      this.setData({
        scrollShow: false
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    const that = this;
    wx.showNavigationBarLoading();
    that.getData();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh();
  }
})
