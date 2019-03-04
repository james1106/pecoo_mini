var app = getApp();
const api = require('../../utils/api.js');
let _allHeight = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    brandData: [],
    listData: [], // 拿此数据进行筛选
    filterList: [], // 筛选后的数据
    searchVal: '', // input搜索的内容
    alpha: '#',
    selectedLetter: '#',
    windowHeight: '',
    scrollTop: 0,
    showAlpha: false,
    searchFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let res = wx.getSystemInfoSync()
      this.pixelRatio = res.pixelRatio
      this.apHeight = 16
      this.offsetTop = 80
      this.setData({ windowHeight: res.windowHeight + 'px' })
    } catch (e) {

    }
    api.queryGoodsbrand({
      userId: app.getUserId(),
    }).then(data => {
      let brandList = [];
      let listData = [];
      for (var i = 0; i < data.brandList.length; i++) {
        data.brandList[i].brand.forEach(ele => {
          listData.push(ele.name)
        })
        brandList.push({ title: data.titleList[i].title, brand: data.brandList[i].brand});
      }
      this.setData({
        hidden: true,
        titleList: data.titleList,
        brandData: brandList,
        listData: listData
      })
      var query = wx.createSelectorQuery();
      query.selectAll('.title').boundingClientRect(function (res) {
        for (let i = 0, l = res.length; i < l; i++) {
          _allHeight.push(res[i].top - 45)
        }
      }).exec();
    })
  },
  // 取消搜索
  cancel () {
    this.setData({
      searchVal: '',
      searchFlag: false,
      filterList: []
    })
  },
  // 聚焦
  focus () {
    this.setData({
      searchFlag: true
    })
  },
  // 搜索
  filterInput (e) {
    let str = e.detail.value;
    let arr = []
    if (str) {
      this.data.listData.forEach(ele => {
        if (ele.indexOf(str) > -1) {
          arr.push(ele)
        }
      })
    } else {
      arr = []
    }
    this.setData({
      searchVal: str,
      filterList: arr
    })
  },
  handlerAlphaTap (e) {
    let ap = e.target.dataset.ap; // 字母
    if (ap == '#') {
      this.setData({
        scrollTop: 0,
        alpha: '#'
      })
    } else {
      this.setData({
        alpha: ap,
        showAlpha: true
      })
    }
    setTimeout(() => {
      this.setData({
        showAlpha: false
      })
    }, 1000)
  },

  handlerMove (e) {
    this.setData({
      alpha: e.target.dataset.ap,
      electedLetter: e.target.dataset.ap
    })
    // this.data.brandData.forEach((ele, index) => {
    //   if (ele.title == e.target.dataset.ap) {
    //     this.setData({
    //       scrollTop: _allHeight[index]
    //     })
    //   }
    // })
    // let { brandData } = this.data;
    // let moveY = e.touches[0].clientY;
    // let rY = moveY - this.offsetTop;
    // if (rY >= 0) {
    //   let index = Math.ceil((rY - this.apHeight) / this.apHeight);
    //   if (0 <= index < brandData.length) {
    //     let nonwAp = brandData[index]
    //     nonwAp && this.setData({ alpha: nonwAp.title });
    //   }
    // }
  },
  scrollContent (e) {
    let scrollTop = e.detail.scrollTop;
    for (var i = 0; i< _allHeight.length - 1; i++) {
      if (e.detail.scrollTop >= _allHeight[i] && e.detail.scrollTop < _allHeight[i + 1]) {
        this.setData({
          selectedLetter: this.data.brandData[i].title
        })
      }
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
    _allHeight = [];
  },
})