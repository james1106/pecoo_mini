const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    banners: [],
    luxuryStory: [],
    swiperIndex: 0,
    totalCount: 0,
    pageNum: 1,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let luxuryBanner = api.luxuryBanner({
      userId: app.getUserId(),
      displayTerminal: 4
    }).then(data => {
      return data.bannerList
    });
    let luxuryGoodsNew = api.luxuryGoodsNew({
      userId: app.getUserId(),
      pageNum: 1,
      pageSize: 10
    }).then(data => {
      return data
    })
    let luxuryStory = api.luxuryStory({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      return data
    });
    Promise.all([luxuryBanner, luxuryGoodsNew, luxuryStory]).then( data => {
      data[1].pageResult.forEach(el => {
        el.price = app.toDecimal2(el.price)
      })
      this.setData({
        luxuryBanner: data[0],
        luxuryGoodsNew: data[1].pageResult,
        luxuryStory: data[2].pageResult,
        totalCount: data[2].totalCount
      })
    })
  },
  // 奢侈品搜索
  searchProduct () {
    wx.navigateTo({
      url: '/pages/extravagancesSearch/extravagancesSearch',
    })
  },
  // 跳转相对应的页面
  jump(e) {
    let obj = e.currentTarget.dataset;
    app.handleJump(obj.gotourl || '', obj.gotoid, obj.gototype, obj.gotokind)
  },
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  // 上拉加载
  onReachBottom: function () {
    if (this.data.luxuryStory.length >= this.data.totalCount) return
    this.setData({
      loading: true
    })
    api.luxuryStory({
      userId: app.getUserId(),
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        loading: false,
        pageNum: data.pageNum,
        luxuryStory: this.data.luxuryStory.concat(data.pageResult)
      })
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    const that = this;
    wx.showNavigationBarLoading();
    that.onLoad();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh();
  }
})