var app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js')
let list = [];
let timer = null;
/**
 * 变量解释
 *  0 --》 拍品订单
 *  1 --》 奢侈品订单
 *  2 --》 金币订单
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    baseImage: app.globalData.baseImageUrl,
    currentCate: 0, // 当前某一类的订单
    loading: false, // 正在加载中
    totalCount: 11111, // 总数
    selected: 1, // 当前状态
    pageNum: 1,
    pageSize: 10,
    scrollTop: 0,
    windowHeight: 0,
    srollHeight: 0,
    cateOrder: [
      {
        id: 0,
        name: '拍品订单'
      },
      {
        id: 1,
        name: '奢侈品订单'
      },
      {
        id: 2,
        name: '金币订单'
      }
    ],
    proOrderProcess: [ // 拍品流程
      {
        title: '全部',
        status: 1
      },
      {
        title: '待确认',
        status: 2
      },
      {
        title: '待付款',
        status: 3
      },
      {
        title: '待发货',
        status: 4
      },
      {
        title: '待收货',
        status: 5
      },
      {
        title: '已完成',
        status: 6
      },
      {
        title: '竞拍失败',
        status: 7
      }
    ],
    extravaganceOrderProcess: [ // 奢侈品流程
      {
        title: '全部',
        status: 1
      },
      {
        title: '待付款',
        status: 3
      },
      {
        title: '待发货',
        status: 4
      },
      {
        title: '待收货',
        status: 5
      },
      {
        title: '已完成',
        status: 6
      },
      {
        title: '失败订单',
        status: 7
      }
    ],
    moneyOrderProcess: [ // 金币流程
      {
        title: '全部',
        status: ''
      },
      {
        title: '待发货',
        status: 10
      },
      {
        title: '待收货',
        status: 25
      },
      {
        title: '已完成',
        status: 30
      }
    ],
    curOrderProcess: [], // 当前默认展示的流程
    orderListData: [] // 订单数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      curOrderProcess: this.data.proOrderProcess,
      selected: options.status || 1
    })
    wx.getSystemInfo({
      success: function (res) {
        let height = res.windowHeight
        that.setData({
          srollHeight: height - 110
        });
      }
    })
  },
  /**
   * 改变 XXXX 订单
   */
  changeCate(e) {
    let id = e.currentTarget.dataset.id * 1
    this.setData({
      currentCate: id,
      orderListData: [],
      loading: false,
      pageNum: 1,
      scrollTop: 0,
      hidden: false,
      selected: id == 2 ? '' : 1 // 当前流程为全部
    })
    let processData = []
    if (id == 0) { // 拍品
      processData = this.data.proOrderProcess
      this.setData({
        curOrderProcess: processData, // 当前订单改变，也要改变订单的流程
      })
      this.getAuctionOrderList(1)
    } else if (id == 1) { // 奢侈品
      this.clearList()
      processData = this.data.extravaganceOrderProcess
      this.setData({
        curOrderProcess: processData, // 当前订单改变，也要改变订单的流程
      })
      this.getLuxuryOrderList(1)
    } else if (id == 2) { // 金币
      this.clearList()
      processData = this.data.moneyOrderProcess
      this.setData({
        curOrderProcess: processData, // 当前订单改变，也要改变订单的流程
      })
      this.getGoldOrderList();
    }
  },
  // 改变流程
  changeProcess(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      selected: status,
      pageNum: 1,
      orderListData: [],
      scrollTop: 0,
      loading: false,
      hidden: false
    })
    if (this.data.currentCate == 0) {
      this.clearList()
      this.getAuctionOrderList(status, 1)
    } else if (this.data.currentCate == 1) {
      this.getLuxuryOrderList(status, 1)
    } else if (this.data.currentCate == 2) {
      this.getGoldOrderList(status, 1)
    }
  },
  // 获取拍品的订单
  getAuctionOrderList(status, pageNum) {
    api.getAuctionOrderList({
      pageNum: pageNum || this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: app.getUserId(),
      orderStatus: status,
    }).then(data => {
      data.pageResult.forEach(ele => {
        ele.sumAmount = app.toDecimal2(ele.sumAmount);
        ele.totalFreightRmb = app.toDecimal2(ele.totalFreightRmb);
        ele.realMoney = app.toDecimal2(ele.realMoney);
      })
      this.timeTask(data.pageResult)
      this.setData({
        totalCount: data.totalCount,
        pageNum: data.pageNum
      })
    })
  },
  
  // 获取奢侈品订单
  getLuxuryOrderList (status, pageNum) {
    api.luxuryOrderList({
      userId: app.getUserId(),
      pageNum: pageNum || this.data.pageNum,
      pageSize: this.data.pageSize,
      orderState: status
    }).then(data => {
      data.pageResult.forEach(ele => {
        ele.priceTotal = app.toDecimal2(ele.priceTotal);
        ele.goodsPrice = app.toDecimal2(ele.goodsPrice);
      })
      this.setData({
        orderListData: data.pageResult,
        totalCount: data.totalCount,
        pageNum: data.pageNum,
        hidden: true
      })
    })
  },
  // 获取金币订单
  getGoldOrderList (status, pageNum) {
    api.goldOrderList({
      userId: app.getUserId(),
      pageNum: pageNum || this.data.pageNum,
      pageSize: this.data.pageSize,
      orderState: status || ''
    }).then(data => {
      this.setData({
        orderListData: data.pageResult,
        totalCount: data.totalCount,
        pageNum: data.pageNum,
        hidden: true
      })
    })
  },
  // 监听拍品的状态改变
  auctionStatus () {
    this.clearList()
    this.setData({
      pageNum: 1,
      orderListData: [],
      hidden: false
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.getAuctionOrderList(this.data.selected);
  },
  // 监听奢侈品的状态改变
  extravagancesStatus () {
    this.setData({
      pageNum: 1
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.getLuxuryOrderList(this.data.selected);
  },
  // 监听金币状态改变
  goldStatus () {
    this.setData({
      pageNum: 1
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.getGoldOrderList(this.data.selected);
  },
  // 随便看看
  goPages () {
    if (this.data.currentCate) {
      wx.switchTab({
        url: '/pages/extravagances/extravagances',
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  // 绑定清关证件
  bindIdCard() {
    wx.navigateBack({
      delta: 1
    })
    app.showToast('绑定证件成功', 'success')
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
    if (this.data.currentCate == 0) {
      this.setData({
        hidden: false
      })
      this.getAuctionOrderList(this.data.selected, 1)
    } else if (this.data.currentCate == 1) {
      this.getLuxuryOrderList(this.data.selected, 1)
    } else if (this.data.currentCate == 2) {
      this.getGoldOrderList(this.data.selected, 1)
    }
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.clearList()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  clearList () {
    clearInterval(timer)
    list = []
    this.setData({
      orderListData: []
    })
  },
  timeTask (data) {
    list = this.data.orderListData.concat(data);
    timer = setInterval( () => {
      list.forEach(ele => {
        if (ele.surplusTime) {
          var aa = (ele.startTime - new Date().getTime()) / 1000;
          var bb = util.dayTimeArr(aa);
          ele.showTime = bb;
        }
      })
      this.setData({
        orderListData: list,
        loading: false,
        hidden: true
      })
    }, 1000)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.orderListData.length >= this.data.totalCount) return false;
    this.setData({
      loading: true
    })
    if (this.data.currentCate == 0) {
      api.getAuctionOrderList({
        pageNum: ++this.data.pageNum,
        pageSize: this.data.pageSize,
        userId: app.getUserId(),
        orderStatus: this.data.selected,
      }).then(data => {
        this.timeTask(data.pageResult)
        this.setData({
          pageNum: data.pageNum,
          loading: false,
        })
      })
    } else if (this.data.currentCate == 1) {
      api.luxuryOrderList({
        userId: app.getUserId(),
        pageNum: ++this.data.pageNum,
        pageSize: this.data.pageSize,
        orderState: this.data.selected
      }).then(data => {
        this.setData({
          orderListData: this.data.orderListData.concat(data.pageResult),
          pageNum: data.pageNum,
          loading: false,
        })
      })
    } else if (this.data.currentCate == 2) {
      api.goldOrderList({
        userId: app.getUserId(),
        pageNum: ++this.data.pageNum,
        pageSize: this.data.pageSize,
        orderState: this.data.selected
      }).then(data => {
        this.setData({
          orderListData: this.data.orderListData.concat(data.pageResult),
          pageNum: data.pageNum,
          loading: false
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})