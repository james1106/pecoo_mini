var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWords: '',
    searchFlag: false,
    take: false,
    hidden: true,
    pageNum: 1,
    pageSize: 10,
    totalCount: 1000,
    history: [],
    recommend: [],
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let history = wx.getStorageSync('auctionHistory') || [];
    api.luxuryCategoryRecommend({
      userId: app.getUserId(),
      type: 0
    }).then(data => {
      this.setData({
        recommend: data.children,
        history: history,
        hidden: true
      })
    })
  },

  getWords (e) {
    if (e.detail.type == 'blur') {
      let history = this.data.history;
      let str = e.detail.detail.value
      if (str.replace(/(^\s+)|(\s+$)/g, "") == '') return;
      this.setData({
        searchFlag: true,
        keyWords: str,
        pageNum: 1
      })
      wx.setNavigationBarTitle({
        title: str
      })
      this.getList();
      this.forHistory(history, str);
    }
  },


  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 对历史记录遍历不记录重复的数据
  forHistory(history, str) {
    let ind = null;
    if (history.length) {
      history.forEach((ele, index) => {
        if (ele == str) {
          ind = index;
          return;
        }
      })
      if (ind != null) {
        history.splice(ind, 1);
      }
    }
    history.unshift(str);
    if (history.length > 10) {
      history.pop();
    }
    wx.setStorageSync('auctionHistory', history)
    this.setData({
      history: history
    })
  },
  // 删除历史纪录
  handleHistory() {
    wx.removeStorageSync('auctionHistory');
    this.setData({
      history: []
    })
  },

  // 点击热门推荐/历史记录
  handleSearchContent(e) {
    this.setData({
      hidden: false
    })
    let title = e.detail.currentTarget.dataset.content
    wx.setNavigationBarTitle({
      title: title
    })
    let history = this.data.history;
    this.forHistory(history, title)
    this.setData({
      searchFlag: true,
      pageNum: 1,
      keyWords: title
    })
    this.getList();
  },


  getList () {
    api.auctionSearch({
      wordName: this.data.keyWords
    }).then(data => {
      this.setData({
        listData: data.pageResult,
        totalCount: data.totalCount,
        hidden: true
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
    wx.showNavigationBarLoading();
    this.getList();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.listData.length >= this.data.totalCount) return;
    this.setData({
      loading: true
    })
    api.auctionSearch({
      wordName: this.data.keyWords,
      pageNum: ++this.data.pageNum,
    }).then(data => {
      this.setData({
        listData: this.data.listData.concat(data.pageResult),
        pageNum: data.pageNum,
        loading: false
      })
    })
  },

})