const app = getApp()
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
let list = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auctions: [],
    pageNumAuction: 1, // 拍会的分页数量
    pageNumAuctionHouse: 1, // 拍行的分页数量
    pageSize: 10,
    hidden: false,
    loading: false,
    baseImg: app.globalData.baseImageUrl,
    searchLoadingComplete: false,
    selectedPicker: '',
    searchVal: '', // 搜索拍卖行的关键字
    pickerData: [],
    selected: 0, // 拍卖会 1为拍卖行
    auctionHouse: [],
    auctionHouseCount: 1000, // 拍行总数量   
    auctionCount: 1000, // 拍会总数量
    showSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 切换拍卖会/拍卖行
  switchAuction (e) {
    let selected = e.currentTarget.dataset.selected*1
    if (this.data.selected == selected) return
    this.setData({
      selected: selected
    })
    if (selected && !this.data.auctionHouse.length) {
      this.getAuctionHouse()
    }
  },
  // 拍卖行搜索
  searchAuctionHouse () {
    this.setData({
      showSearch: true
    })
  },
  // 取消搜索
  cancelSearch () {
    this.setData({
      pageNumAuctionHouse: 1,
      showSearch: false,
      searchVal: ''
    })
    this.getAuctionHouse();
  },
  // 搜索拍卖会
  searchList (e) {
    if (e.detail.type == 'blur') {
      let val = e.detail.detail.value;
      this.setData({
        pageNumAuctionHouse: 1,
        searchVal: val,
      })
      this.getAuctionHouse();
    }
  },
  // 拍卖会列表请求
  getAuction () {
    api.auctionList({
      userId: app.getUserId(),
      pageNum: this.data.pageNumAuction,
      pageSize: this.data.pageSize,
      startTime: this.data.selectedPicker
    }).then(data => {
      let arr = data.dateFacetList;
      arr.unshift({
        calendarDate: '',
        calendarDateMobile: '全部'
      })
      this.getTimeSet(data.auctions)
      this.setData({
        pickerData: arr,
        auctionCount: data.totalCount
      })
    }).catch( err => {
      this.setData({
        hidden: true
      })
    })
  },
  // 拍卖行列表请求
  getAuctionHouse () {
    api.auctionHouseList({
      pageNum: this.data.pageNumAuctionHouse,
      pageSize: this.data.pageSize,
      keyword: this.data.searchVal
    }).then(data => {
      this.setData({
        auctionHouse: data.pageResult,
        auctionHouseCount: data.totalCount,
        hidden: true
      })
    })
  },
  // 日期筛选
  changeDate (e) {
    if (this.data.selectedPicker === pickerNum) return
    this.clearAuctionsData()
    let pickerNum = e.currentTarget.dataset.picker
    this.setData({
      selectedPicker: pickerNum,
      pageNumAuction: 1,
      auctions: [],
      hidden: false
    })
    api.auctionList({
      pageNo: this.data.pageNumAuction,
      pageSize: this.data.pageSize,
      startTime: pickerNum
    }).then(data => {
      this.setData({
        pageNum: data.pageNo,
        auctionCount: data.totalCount
      })
      this.getTimeSet(data.auctions);
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hidden: false,
      pageNumAuction: 1,
      searchLoadingComplete: false
    })
    this.getAuction();
  },
  endinterval: function () {
    for (var i = 0; i <= list.length; i++) {
      clearInterval(i)
    }
  },
  clearAuctionsData() {
    this.endinterval();
    list = [];
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.clearAuctionsData()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearAuctionsData()
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
    if (this.data.selected) { // 拍卖行
      if (this.data.auctionHouse.length >= this.data.auctionHouseCount) return;
      this.setData({
        loading: true
      })
      api.auctionHouseList({
        pageNum: ++this.data.pageNumAuctionHouse,
        pageSize: this.data.pageSize,
        userId: app.getUserId(),
        keyword: this.data.searchVal
      }).then(data => {
        this.setData({
          pageNumAuctionHouse: data.pageNum,
          auctionHouse: this.data.auctionHouse.concat(data.pageResult),
          loading: false
        })
      })
    } else {
      if (this.data.auctions.length >= this.data.auctionCount) return;
      this.setData({
        loading: true
      })
      api.auctionList({
        pageNum: ++this.data.pageNumAuction,
        pageSize: this.data.pageSize,
        userId: app.getUserId(),
        startTime: this.data.selectedPicker
      }).then(data => {
        this.getTimeSet(data.auctions)
        this.setData({
          pageNumAuction: data.pageNo,
          loading: false
        })
      })
    }
  },
  getTimeSet (data, notConcat) {
    let that = this;
    list = that.data.auctions.concat(data);
    var ref = setInterval(function () {
      list.forEach(function (v) {
        var aa = (v.startTime - new Date().getTime()) / 1000;
        var bb = util.dayTimeArr(aa);
        v.ShowTime = bb;
      });
      if (data.length < 10) {
        that.setData({
          auctions: list,
          hidden: true,
          loading: false,
          searchLoadingComplete: true
        })
      } else {
        that.setData({
          auctions: list,
          hidden: true,
          loading: false,
        })
      }
    }, 1000);
  }
})
