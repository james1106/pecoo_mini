const app = getApp()
const api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    hidden: false,
    sortHead1: '下单时间',
    sortHead2: '订单状态',
    selectedSortIndex: null, // 当前选中筛选的下标
    recommendOrder: [],
    sort: '', // 发送给后端的时间排序
    orderStatus: '', // 发送给后端的订单状态排序
    TimeSortList:  [ // 下单时间的筛选
      {
        sort: '',
        name: '默认排序'
      },
      {
        sort: 'create_time/01',
        name: '最近下单'
      },
      {
        sort: 'create_time/02',
        name: '最早下单'
      },
    ],
    orderStatusList: [ // 订单状态的筛选
      {
        orderStatus: '',
        name: '全部'
      },
      {
        orderStatus: '00',
        name: '下单未付款'
      },
      {
        orderStatus: '01',
        name: '已下单'
      },
      {
        orderStatus: '10',
        name: '开始竞拍'
      },
      {
        orderStatus: '15',
        name: '竞拍成功'
      },
      {
        orderStatus: '20',
        name: '待发货'
      },
      {
        orderStatus: '25',
        name: '待收货'
      },
      {
        orderStatus: '30',
        name: '已完成'
      },
      {
        orderStatus: '90',
        name: '已取消'
      },
      {
        orderStatus: '92',
        name: '竞拍失败'
      },
      {
        orderStatus: '94',
        name: '违约冻结'
      },
      {
        orderStatus: '96',
        name: '确认违约'
      }
    ],
    totalCount: 0,
    hidden: false,
    baseImg: app.globalData.baseImageUrl
  },
  onShow: function () {
    
  },
 
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData()
  },
  getListData (sort, orderStatus) {
    console.log(sort, orderStatus)
    api.recommendOrder({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      sort: sort || this.data.sort,
      orderStatus: orderStatus || this.data.orderStatus
    }).then(data => {
      data.pageResult.forEach( el => {
        el.voucherMoney = app.toDecimal2(el.voucherMoney)
      })
      this.setData({
        totalCount: data.totalCount,
        recommendOrder: data.pageResult,
        hidden: true
      })
    })
  },
  changeSortIndex (e) {
    let index = e.currentTarget.dataset.index * 1
    if (this.data.selectedSortIndex == index ) {
      this.setData({
        selectedSortIndex: null
      })
    } else {
      this.setData({
        selectedSortIndex: index
      })
    }
  },
  // 时间改变的方法
  timeChangeList (e){
    let obj = e.currentTarget.dataset
    this.setData({
      pageNum: 1,
      sortHead1: obj.name,
      sort: obj.sort,
      selectedSortIndex: null,
      hidden: false
    })
    this.getListData(obj.sort, this.data.orderStatus)
  },
  statusChangeList (e) {
    let obj = e.currentTarget.dataset
    this.setData({
      pageNum: 1,
      sortHead2: obj.name,
      orderStatus: obj.status,
      selectedSortIndex: null,
      hidden: false
    })
    this.getListData(this.data.sort, obj.status)
  },
  cancelMask () {
    this.setData({
      selectedSortIndex: null
    })
  },
  onReachBottom: function () {
    api.recommendOrder({
      userId: app.getUserId(),
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize,
      sort: this.data.sort,
      orderStatus: this.data.orderStatus
    }).then(data => {
      this.setData({
        pageNum: data.pageNum,
        recommendOrder: this.data.recommendOrder.concat(data.pageResult),
        totalCount: data.totalCount
      })
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  
})