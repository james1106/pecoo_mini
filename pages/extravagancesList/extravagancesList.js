var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    loading: false,
    goodsBrand: '', // 当前品牌
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    listData: [
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500' 
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '500'
      }
    ],
    screenData: [
      'Ancient Greek Sandals1', 'Ancient Greek Sandals2', 'Ancient Greek Sandals3', 'Ancient Greek Sandals4'
    ],
    mask: false,
    searchContent: '', // 也可以说是开关变量，内容拿取了暂时未用到
    historyData: ['aa', 'bb', 'vv'],
    recommendData: ['11', '22', '3333']
  },

  onMyEvent (e) {
    let val = e.detail.detail.value
    this.setData({
      mask: true,
      searchContent: val
    })
  },

  clearContent (val) {
    this.setData({
      searchContent: '',
      listData: this.data.listData
    })
  },

  delHistory () {
    this.setData({
      historyData: []
    })
  },

  cancel () {
    this.setData({
      mask: false
    })
  },

  changeSearchContent (e) {
    let listData = [
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '600'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '600'
      },
      {
        image: 'https://pic.pecoo.com/FskpOGvCiMLDgtN0_3OU-Rd0quCv?imageMogr2/thumbnail/!50p/quality/90!/format/jpg',
        pkId: '001',
        name: 'IMPORTANT COLCOLCOLCOL',
        priceUnit: '$',
        price: '660'
      }
    ]
    this.selectComponent(".search-box").changeSearchContent(this.data.searchContent) // 调用子组件的方法
    // 发起请求，拿取返回结果进行赋值
    this.setData({
      searchContent: this.data.screenData[e.currentTarget.dataset.index],
      mask: false,
      listData: listData
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.luxuryGoodsList({
      userId: app.getUserId(),
      goodsBrand: options.brand || '',
      pageNum: 1,
      pageSize: 10
    }).then(data => {
      this.setData({
        goodsBrand: options.goodsBrand,
        listData: data.luxuryData.pageResult,
        totalCount: data.luxuryData.totalCount,
        hidden: true
      })
    })
  },

  goDetail (e) {
    wx.navigateTo({
      url: '/pages/extravagancesDetail/extravagancesDetail?id=' + e.detail.currentTarget.dataset.id,
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
    if (this.data.listData.length >= this.data.totalCount) return    
    this.setData({
      loading: true
    })
    api.luxuryGoodsList({
      userId: app.getUserId(),
      goodsBrand: this.data.goodsBrand,
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        listData: this.data.listData.concat(data.luxuryData.pageResult),
        pageNum: data.luxuryData.pageNum,
        loading: true
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})