var app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceUnit: '', // 货币
    priceStart: '', // 开始价格
    priceEnd: '', // 结束价格
    startTime: '', // 开拍时间
    money: '', // 筛选页渲染的选中的值
    picker: '', // 筛选页渲染的选中的值
    baseImg: app.globalData.baseImageUrl,
    scrollH: 0,
    sortList: [
      {
        name: '价格',
        children: [
          {
            name: '默认排序',
            sort: ''
          },
          {
            name: '价格最低',
            sort: 'start_price/02'
          },
          {
            name: '价格最高',
            sort: 'start_price/01'
          }
        ]
      },
      {
        name: '开拍时间',
        children: [
          {
            name: '默认排序',
            sort: ''
          },
          {
            name: '最近开拍',
            sort: 'start_time/02'
          },
          {
            name: '最晚开拍',
            sort: 'start_time/01'
          }
        ]
      }
    ],
    listData: [], // 页面渲染的列表
    cateList: [], // 分类的条件数据
    htmlwords: '分类',
    editCate: false, // 看是否点击了分类
    condition: [], // 页面渲染的条件数据
    kindCode: '', // 当前分类的code值
    selectedIndex: 999, // 表示当前点击的是价格&开拍时间的选中效果
    selectedId: 0, // 价格
    sort: '', // 价格和开拍时间的筛选条件
    conditionFlag: false,
    totalCount: 0, // 总数量
    pageNum: 1,
    pageSize: 20,
    headIndex: '', // 当前价格和开拍时间的下标
    loading: false, // 加载更多
    hidden: false,
    showGoBack: false,
    scrollTop: 0
  },
  
  // 滚动显示距离,是否显示回到顶部图片
  scrollPage(e) {
    if (e.detail.scrollTop > 500) {
      if (!this.data.showGoBack) {
        this.setData({
          showGoBack: true
        })
      }
    } else {
      if (this.data.showGoBack) {
        this.setData({
          showGoBack: false
        })
      }
    }
  },
  // 回到顶部
  backTop () {
    this.setData({
      scrollTop: 1 // 为1表示回到顶部时不出发下拉刷新得函数
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name || '商品分类' //页面标题为路由参数
    })
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollH: res.windowHeight - 156 / 2
        })
      }
    })
    let twoCategory = api.twoCategory({
      code: options.code
    }).then(data => {
      data.forEach(ele => {
        ele.isChecked = false
      })
      return data
    })
    let goodsList = api.queryGoodsByKind({
      kindCode: options.code,
      pageNum: 1,
      pageSize: 20
    }).then(data => {
      return data
    })
    Promise.all([twoCategory, goodsList]).then(data => {
      this.setData({
        kindCode: options.code,
        cateList: data[0],
        listData: data[1].pageResult,
        totalCount: data[1].totalCount,
        hidden: true
      })
    })
  },
  // 去搜索内容
  goSearch () {
    wx.navigateTo({
      url: '/pages/auctionSearch/auctionSearch',
    })
  },
  // 去筛选
  goScreen () {
    wx.navigateTo({
      url: `/pages/screen/screen?priceUnit=${this.data.priceUnit}&priceStart=${this.data.priceStart}&priceEnd=${this.data.priceEnd}&startTime=${this.data.startTime}&kindCode=${this.data.kindCode}&money=${this.data.money}&picker=${this.data.picker}`,
    })
  },
  // 对价格和开拍时间不可共存的处理
  changeList (e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.editCate) { // 判断当前是否点击分类
      this.setData({
        editCate: false
      })
    }
    if (index == this.data.selectedIndex) {
      this.setData({
        conditionFlag: false,
        selectedIndex: 999
      })
    } else {
      this.setData({
        conditionFlag: true,
        selectedIndex: index,
        headIndex: index,
        condition: this.data.sortList[index].children
      })
    }
  },
  // 对于分类的修改
  changeCate (e) {
    if (this.data.selectedIndex != 999) {
      this.setData({
        condition: this.data.cateList,
        selectedIndex: 999,
        editCate: true
      })
    } else {
      if (this.data.editCate) {
        this.setData({
          conditionFlag: false,
          editCate: false
        })
      } else {
        this.setData({
          editCate: true,
          conditionFlag: true,
          condition: this.data.cateList
        })
      }
    }
  },
  // 筛选条件
  changeConditions(priceUnit = '', priceStart = '', priceEnd = '', startTime = '', brandCateCode = '', brandName = '', money = '', cate = '', picker = '') {
    this.setData({
      priceUnit: priceUnit,
      priceStart: priceStart,
      priceEnd: priceEnd,
      startTime: startTime,
      brandName: brandName,
      money: money,
      picker: picker,
    })
    wx.navigateBack({
      delta: 1
    })
    this.getListData(this.data.kindCode, 1, this.data.sort, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.startTime);
  },
  // 点击遮罩显示的内容
  clickCate (e) {
    let obj = e.currentTarget.dataset;
    if (this.data.editCate) { // 表示为分类
      this.data.cateList.forEach((ele, index) => { // 此循环是为了以后方便多选的需求
        if (index == obj.index) {
          ele.isChecked = true
        } else {
          ele.isChecked = false
        }
      })
      this.setData({
        kindCode: obj.code,
        htmlwords: obj.name,
        conditionFlag: false,
        editCate: false,
        cateList: this.data.cateList,
        condition: this.data.cateList,
        pageNum: 1
      })
    } else {
      let sortList = this.data.sortList;
      if (this.data.headIndex == 0) {
        sortList[0].name = e.currentTarget.dataset.name
        sortList[1].name = '开拍时间'
      } else if (this.data.headIndex == 1) {
        sortList[1].name = e.currentTarget.dataset.name
        sortList[0].name = '价格'
      }
      this.setData({
        sort: obj.sort,
        conditionFlag: false,
        selectedIndex: 999,
        pageNum: 1,
        sortList: sortList
      })
    }
    this.getListData(this.data.kindCode, 1, this.data.sort, this.data.priceUnit, this.data.priceStart, this.data.priceEnd, this.data.startTime);
  },
  // 获取数据封装， 传递参数
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
        pageNum: data.pageNum,
        totalCount: data.totalCount
      })
    })
  },
  // 点击阴影隐藏展开的东西
  hide () {
    this.setData({
      conditionFlag: false,
      selectedIndex: 999,
      editCate: false
    })
  },
  // 上拉加载更多
  loadmore() {
    if (this.data.listData.length >= this.data.totalCount) {
      this.setData({
        loading: false
      })
      return
    } else {
      this.setData({
        loading: true
      })
    }
    api.queryGoodsByKind({
      userId: app.getUserId(),
      kindCode: this.data.kindCode,
      pageNum: ++this.data.pageNum,
      pageSize: 20,
      sort: this.data.sort,
      priceUnit: this.data.priceUnit,
      priceStart: this.data.priceStart,
      priceEnd: this.data.priceEnd,
      startTime: this.data.startTime
    }).then(data => {
      this.setData({
        hidden: true,
        loadmoreFlag: false,
        loading: false,
        listData: this.data.listData.concat(data.pageResult),
        pageNum: data.pageNum,
        totalCount: data.totalCount
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
  // 下拉刷新
  refresh () {
    wx.showNavigationBarLoading();
    api.queryGoodsByKind({
      userId: app.getUserId(),
      kindCode: this.data.kindCode,
      pageNum: 1,
      pageSize: 20,
      sort: this.data.sort,
      priceUnit: this.data.priceUnit,
      priceStart: this.data.priceStart,
      priceEnd: this.data.priceEnd,
      startTime: this.data.startTime
    }).then(data => {
      this.setData({
        hidden: true,
        loadmoreFlag: false,
        loading: false,
        listData: data.pageResult,
        pageNum: data.pageNum,
        totalCount: data.totalCount
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   console.log('1')
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  
  // },

})