var app = getApp();
const api = require('../../utils/api.js');
Page({
  data: {
    priceUnit: '', // 货币
    priceStart: '', // 开始价格
    priceEnd: '', // 结束价格
    startTime: '', // 开拍时间
    sex: '', // 适用群体
    sort: '', // 筛选条件
    money: '', // 筛选页渲染的选中的值
    picker: '', // 筛选页渲染的选中的值
    cate: '', // 筛选页渲染的选中的值
    brandName: '', // 奢侈品筛选品牌名称
    brandCateCode: '', // 奢侈品分类code值
    sexName: '', // 选中的群体
    currentType: '', // 当前类型，拿来筛选的时候做判断
    condition: [], // 头部条件
    brand: '', // 分类页点击品牌进来时的品牌
    scrollHeight: '',
    show: false,
    upLoading: false,
    pageNum: 1,
    pages: 0,
    hidden: false,
    kindCode: '',
    listData: [],
    selected: 0, // 选择的头部
    baseImg: app.globalData.baseImageUrl
  },

  // 改变头部 传递sort
  changeCondition (e) {
    if (this.data.selected == e.currentTarget.dataset.id) return
    this.backTop();
    this.setData({
      selected: e.currentTarget.dataset.id,
      sort: e.currentTarget.dataset.sort,
      pageNum: 1
    })
    if (this.data.currentType == '12') {
      this.getLuxuryListData(this.data.kindCode, this.data.brandName, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.sort, 1, 20);
    } else if (this.data.currentType == '15') {
      this.getLuxuryListData(this.data.brandCateCode, this.data.brand, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.sort, 1, 20);
    } else {
      this.getListData(this.data.kindCode, this.data.pageNum, e.currentTarget.dataset.sort, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.startTime);
    }
  },
  

  // 获取列表数据
  getListData(kindCode, pageNum, sort, priceUnit, priceStart, priceEnd, startTime) {
    api.queryGoodsByKind({
      userId: app.getUserId(),
      kindCode: kindCode,
      pageNum: pageNum || 1,
      pageSize: 20,
      sort: sort || '',
      priceUnit: priceUnit || '',
      priceStart: priceStart || '',
      priceEnd: priceEnd || '',
      startTime: startTime || ''
    }).then(data => {
      this.setData({
        hidden: true,
        loadmoreFlag: false,
        listData: data.pageResult,
        pages: data.pages,
        pageNum: data.pageNum,
        totalCount: data.totalCount
      })
    })
  },
  // 获取奢侈品列表数据
  getLuxuryListData(kindType, goodsBrand, priceUnit, priceStart, priceEnd, sort, pageNum, pageSize, sex = '') {
    api.luxuryGoodsList({
      kindType: kindType || '',
      goodsBrand: goodsBrand || '',
      priceUnit: priceUnit || '',
      priceStart: priceStart || '',
      priceEnd: priceEnd || '',
      sort: sort || '',
      pageNum: pageNum || 1,
      pageSize: pageSize || 20,
      sex: sex
    }).then(data => {
      this.setData({
        hidden: true,
        loadmoreFlag: false,
        listData: data.pageResult,
        pages: data.pages,
        pageNum: data.pageNum,
        totalCount: data.totalCount
      })
    })
  },
  backTop(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 38,
          kindCode: options.code || '',
          currentType: options.type || ''
        })
      }
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
    let condition = [];
    if (options.type == '12') {
      this.getLuxuryListData(options.code);
      condition = [
        { title: '热门', sort: '', id: 0 },
        { title: '价格最低', sort: 'price/02', id: 1 },
        { title: '最新上架', sort: 'start_date/01', id: 2 }
      ]
      this.setData({
        kindCode: options.code,
        condition: condition
      })
    } else if (options.type == '15'){
      this.getLuxuryListData('', options.code );
      condition = [
        { title: '热门', sort: '', id: 0 },
        { title: '价格最低', sort: 'price/02', id: 1 },
        { title: '最新上架', sort: 'start_date/01', id: 2 }
      ]
      this.setData({
        brand: options.code,
        condition: condition
      })
    } else {
      this.getListData(options.code, 1);
      condition = [
        { title: '热门', sort: '', id: 0 },
        { title: '价格最低', sort: 'start_price/02', id: 1 },
        { title: '最近开拍', sort: 'start_time/02', id: 2 }
      ]
      this.setData({
        kindCode: options.code,
        condition: condition
      })
    }
  },
   
  // 筛选条件
  changeConditions(priceUnit, priceStart, priceEnd, startTime, brandCateCode, brandName, money, cate, picker, sexName, sex) {
    // 12 分类  15 品牌
    console.log(sex)
    this.setData({
      priceUnit: priceUnit || '',
      priceStart: priceStart || '',
      priceEnd: priceEnd || '',
      startTime: startTime || '',
      brandCateCode: brandCateCode || '', // 奢侈品筛选的code值
      brandCode: brandName ? brandName : this.data.brandName,
      brandName: brandName || '',
      money: money || '',
      cate: cate || '',
      picker: picker || '',
      sexName: sexName || '',
      sex: sex
    })
    wx.navigateBack({
      delta: 1
    })
    if (this.data.currentType == '12') {
      console.log(this.data.sex)
      this.getLuxuryListData(this.data.kindCode, brandName, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.sort, 1, 20, this.data.sex);
    } else if (this.data.currentType == '15') {
      console.log(this.data.sex)
      this.getLuxuryListData(brandCateCode, this.data.brand, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.sort, 1, 20, this.data.sex);
    } else {
      this.getListData(this.data.kindCode, 1, this.data.sort, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.startTime);
    }
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

  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop > 300) {
      this.setData({
        show: true
      })
    } else {
      this.setData({
        show: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (this.data.currentType == '12') {
      this.getLuxuryListData(this.data.kindCode, this.data.brandName, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.sort, 1, 20, this.data.sex);
    } else if (this.data.currentType == '15') {
      this.getLuxuryListData(this.data.brandCateCode, this.data.brand, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.sort, 1, 20, this.data.sex);
    } else {
      this.getListData(this.data.kindCode, 1, this.data.sort, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.startTime);
    }
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  
  onReachBottom: function () {
    if (this.data.listData.length >= this.data.totalCount) return;
    this.setData({
      upLoading: true
    })
    if (this.data.currentType == '12') {
      api.luxuryGoodsList({
        kindType: this.data.kindCode,
        goodsBrand: this.data.brandName,
        priceUnit: this.data.priceUnit,
        priceStart: this.data.priceStart,
        priceEnd: this.data.priceEnd,
        sort: this.data.sort,
        pageNum: ++this.data.pageNum,
        pageSize: 20,
        sex: this.data.sex
      }).then(data => {
        this.setData({
          upLoading: false,
          pageNum: data.pageNum,
          listData: this.data.listData.concat(data.pageResult)
        })
      })
    } else if (this.data.currentType == '15') {
      api.luxuryGoodsList({
        kindType: this.data.brandCateCode,
        goodsBrand: this.data.brand,
        priceUnit: this.data.priceUnit,
        priceStart: this.data.priceStart,
        priceEnd: this.data.priceEnd,
        sort: this.data.sort,
        pageNum: ++this.data.pageNum,
        pageSize: 20,
        sex: this.data.sex
      }).then(data => {
        data.pageResult.forEach(ele => {
          ele.priceDiscount = ele.priceDiscount.toFixed(1)
        })
        this.setData({
          upLoading: false,
          pageNum: data.pageNum,
          listData: this.data.listData.concat(data.pageResult)
        })
      })
    } else {
      api.queryGoodsByKind({
        userId: app.getUserId(),
        kindCode: this.data.kindCode,
        pageNum: ++this.data.pageNum,
        pageSize: 20,
        sort: this.data.sort,
        priceUnit: this.data.priceUnit, // 货币
        priceStart: this.data.priceStart, // 开始价格
        priceEnd: this.data.priceEnd, // 结束价格
        startTime: this.data.startTime
      }).then(data => {
        this.setData({
          upLoading: false,
          pageNum: data.pageNum,
          listData: this.data.listData.concat(data.pageResult)
        })
      })
    }
  }
})