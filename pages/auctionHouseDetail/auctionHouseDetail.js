 const app = getApp()
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
var list = [];
const colleType = '04';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    saleList: [],
    hidden: false,
    pageNum: 1,
    pageSize: 10,
    hidden: false,
    baseImg: app.globalData.baseImageUrl,
    curAuctionHouseObj: {},
    totalCount: 1000,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    api.auctionHouseDetail({
      auctionHouseId: options.id
    }).then(data => {
      this.setData({
        curAuctionHouseObj: data
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
    api.auctionList({
      userId: app.getUserId(),
      auctionHouseId: this.data.id,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        totalCount: data.totalCount,
      })
      this.getTimeSet(data.auctions)
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.endinterval();
    this.setData({
      saleList: [],
      pageNo: 1
    })
    list = []
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.endinterval();
    this.setData({
      saleList: [],
      pageNum: 1
    })
    list = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  // 设置收藏
  setCollection() {
    api.addUserCollection({
      'goodsId': this.data.curAuctionHouseObj.id,
      'userId': app.getUserId(),
      'colleType': colleType
    }).then(data => {
      let curAuctionHouseObj = this.data.curAuctionHouseObj;
      curAuctionHouseObj.collectionStatus = 1
      this.setData({
        curAuctionHouseObj: curAuctionHouseObj
      })
      app.showToast('收藏成功');
    })
  },
  // 取消收藏
  cancelCollection() {
    api.delUserCollection({
      goodsIds: this.data.curAuctionHouseObj.id,
      userId: app.getUserId(),
      colleType: colleType
    }).then(data => {
      let curAuctionHouseObj = this.data.curAuctionHouseObj;
      curAuctionHouseObj.collectionStatus = 0
      this.setData({
        curAuctionHouseObj: curAuctionHouseObj
      })
      app.showToast('已取消收藏');
    })
  },
  /**
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    api.auctionList({
      userId: app.getUserId(),
      auctionHouseId: this.data.curAuctionHouseObj.id,
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.getTimeSet(data.auctions)
    })
  },
  endinterval: function () {
    for (var i = 0; i <= list; i++) {
      clearInterval(i)
    }
  },
  getTimeSet: function (data) {
    list = this.data.saleList.concat(data);
    var that = this;
    var ref = setInterval(function () {
      list.forEach(function (v) {
        var aa = (v.startTime - new Date().getTime()) / 1000;
        var bb = util.dayTimeArr(aa);
        v.ShowTime = bb;
      });
      that.setData({
        saleList: list,
        hidden: true,
      })
    }, 1000);
  }
})
