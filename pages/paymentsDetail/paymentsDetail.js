const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: ['充值记录', '提现记录', '消费记录'],
    selectedTab: 0,
    recordsList: [],
    pageNum: 1,
    pageSize: 10,
    hidden: false,
    totalCount: 100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.rechargeRecord()
  },
  switchTab (e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.selectedTab) return
    this.setData({
      selectedTab: index,
      hidden: false,
      recordsList: [],
      pageNum: 1
    })
    if (index == 0) {
      this.rechargeRecord();
    } else if (index == 1) {
      this.showRecord();
    } else {
      this.consumeRecord();
    }
  },
  // 充值记录
  rechargeRecord () {
    api.rechargeRecord({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: app.getUserId()
    }).then(data => {
      this.setData({
        recordsList: data.pageResult,
        totalCount: data.totalCount,
        hidden: true
      })
    })
  },
  // 提现记录
  showRecord () {
    api.showRecord({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: app.getUserId()
    }).then(data => {
      this.setData({
        recordsList: data.pageResult,
        totalCount: data.totalCount,
        hidden: true
      })
    })
  },
  // 消费记录
  consumeRecord () {
    api.consumeRecord({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: app.getUserId()
    }).then(data => {
      this.setData({
        recordsList: data.pageResult,
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
    console.log(this.data.recordsList.length, this.data.totalCount)    
    if (this.data.recordsList.length < this.data.totalCount) {
      this.setData({
        loading: true
      })
      if (this.data.selectedTab == 0) {
        api.rechargeRecord({
          pageNum: ++this.data.pageNum,
          pageSize: this.data.pageSize,
          userId: app.getUserId()
        }).then(data => {
          this.setData({
            recordsList: this.data.recordsList.concat(data.pageResult),
            pageNum: data.pageNum,
            loading: false
          })
        })
      } else if (this.data.selectedTab == 1) {
        api.showRecord({
          pageNum: ++this.data.pageNum,
          pageSize: this.data.pageSize,
          userId: app.getUserId()
        }).then(data => {
          this.setData({
            recordsList: this.data.recordsList.concat(data.pageResult),
            pageNum: data.pageNum,
            loading: false
          })
        })
      } else {
        api.consumeRecord({
          pageNum: ++this.data.pageNum,
          pageSize: this.data.pageSize,
          userId: app.getUserId()
        }).then(data => {
          this.setData({
            recordsList: this.data.recordsList.concat(data.pageResult),
            pageNum: data.pageNum,
            loading: false
          })
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})