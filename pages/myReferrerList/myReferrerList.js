const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userRecommendsList: [],
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    hidden: false,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.recommendList({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        userRecommendsList: data.pageResult,
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


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.userRecommendsList.length >= this.data.totalCount) return;
    this.setData({
      loading: true
    })
    api.queryUserRecommends({
      userId: app.getUserId(),
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        loading: false,
        pageNum: this.data.pageNum,
        userRecommendsList: this.data.userRecommendsList.concat(data.pageResult)
      })
    })
  }
})