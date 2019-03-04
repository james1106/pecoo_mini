var app = getApp();
const api = require('../../utils/api.js');
// voucherRange --》 1 平台通用  --》 2 保证金券  --》 3 奢侈品 -- 》4 拍卖商品
Page({
  data: {
    pageNum: 1,
    totalCount: 0,
    countActivation: '',
    countUsed: '',
    countOverdue: '',
    currentTab: 2, // 预设当前项的值
    hidden: false,
    loading: false,
    baseImg: app.globalData.baseImageUrl,
    voucherList:[],
    voucherCode:'',
    height: 0
  },
  // 点击标题切换当前页时改变样式
  switchHead: function (e) {
    var cur = e.target.dataset.current;
    this.setData({
      currentTab: cur,
      pageNum: 1,
      hidden: false,
      voucherList: []
    })
    this.getProvideList(cur)
  },
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          height: res.windowHeight - 125
        })
      }
    })
    if (options.voucherRange == 2) {
      this.setData({
        currentTab: 3
      })
    }
  },
  use () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  getProvideList(status, pageNum) {
    api.voucherList({
      userId: app.getUserId(),
      pageNum: pageNum || 1,
      pageSize: 10,
      voucherStatus: status
    }).then(data => {
      this.setData({
        countActivation: data.countActivation,
        countOverdue: data.countOverdue,
        countUsed: data.countUsed,
        voucherList: data.provideEntities,
        hidden: true
      })
    })
  },
  voucherInput (e) {
    this.setData({
      voucherCode: e.detail.value
    })
  },
  // 兑换
  exchange () {
    api.voucherUpdateStatus({
      userId: app.getUserId(),
      voucherCode: this.data.voucherCode,
    }).then(data => {
      if (data.voucherType) {
        app.showToast('代金券兑换成功', 'success', function () {
          this.getProvideList(this.data.currentTab)
        }.bind(this))
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
    api.voucherList({
      userId: app.getUserId(),
      pageNum: 1,
      pageSize: 10,
      voucherStatus: this.data.currentTab
    }).then(data => {
      this.setData({
        countActivation: data.countActivation,
        countOverdue: data.countOverdue,
        countUsed: data.countUsed,
        voucherList: data.provideEntities,
        hidden: true
      })
    })
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
  loadmore () {
    if (this.data.currentTab == 2) {
      if (this.data.voucherList.length >= this.data.countActivation) return
    } else if (this.data.currentTab == 3) {
      if (this.data.voucherList.length >= this.data.countUsed) return
    } else if (this.data.currentTab == 4) {
      if (this.data.voucherList.length >= this.data.countOverdue) return
    }
    this.setData({
      loading: true
    })
    api.voucherList({
      userId: app.getUserId(),
      pageNum: ++this.data.pageNum,
      pageSize: 10,
      voucherStatus: this.data.currentTab
    }).then(data => {
      this.setData({
        pageNum: data.pageNum,
        voucherList: this.data.voucherList.concat(data.provideEntities),
        loading: false
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
})