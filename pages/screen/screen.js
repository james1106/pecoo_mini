const app = new getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    kindCode: '', // 当前kindCode
    dateList: [], // 时间选择
    unitList: [], // 币种选择
    cateList: [], // 分类选择
    brandList: [], // 品牌选择
    allBrandList: [], // 更多品牌
    sexList: [{ name: '女', sex: 1 }, { name: '男', sex: 0 }], // 适用群体
    unitCode: '', // 币种code
    dateCode: '', // 日期code
    minPrice: '', // 最小价格
    maxPrice: '', // 最大价格
    cateCode: '', // 奢侈品的当前分类Code
    brandCode: '', // 奢侈品的当前品牌code
    currentType: '', // 区分当前是奢侈品得筛选还是拍品筛选
    sex: '', // 入参男女得字段
    money: '',
    picker: '',
    cate: '', // 分类
    brand: '', // 品牌
    sexName: '', // 适用群体
    baseImg: app.globalData.baseImageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      unitCode: options.money ? options.priceUnit : '',
      dateCode: options.startTime || '',
      minPrice: options.priceStart || '',
      maxPrice: options.priceEnd || '',
      currentType: options.currentType || '',
      kindCode: options.kindCode || '',
      cateCode: options.brandCateCode || '',
      picker: options.picker || '',
      brand: options.brand || '',
      brandCode: options.brand || '',
      cate: options.cate || '',
      money: options.money || '',
      sexName: options.sexName || ''
    })
    switch (options.currentType) {
      case '12': // 分类
        this.getLuxuryCateFilter();
        break;
      case '15': // 品牌
        this.getLuxuryBrandFilter();
        break;
      default: 
        this.getQueryFilterList();
        break;
    }
  },
  // 获取正常的筛选条件
  getQueryFilterList () {
    api.queryFilterList({
      userId: app.getUserId(),
    }).then(data => {
      data.unitList.forEach(ele => {
        if (ele.name == this.data.money) {
          ele.isCheck = true
        } else {
          ele.isCheck = false
        }
      })
      this.setData({
        dateList: data.dateList,
        unitList: data.unitList,
        hidden: true
      })
    })
  },
  // 获取奢侈品的品牌的筛选
  getLuxuryCateFilter () {
    api.luxuryCateFilter({
      categoryCode: this.data.kindCode 
    }).then(data => {
      data.unitList.forEach(ele => {
        if (ele.name == this.data.money) {
          ele.isCheck = true
        } else {
          ele.isCheck = false
        }
      })
      if (data.brandList.length > 6) {
        let brandList = [];
        let brandCode = this.data.brand ? 'loadmorebrand' : '';
        for (let i = 0; i < 5 ; i++) {
          if (data.brandList[i].code == this.data.brandCode) {
            brandCode = data.brandList[i].code
          }
          brandList.push(data.brandList[i]);
        }
        let obj = {code: 'loadmorebrand', name: '更多品牌'};
        brandList.push(obj);
        this.setData({
          brandList: brandList,
          brandCode: brandCode,
          allBrandList: data.brandList, // 所有的品牌
          unitList: data.unitList,
          hidden: true
        })
      } else {
        this.setData({
          brandList: data.brandList,
          unitList: data.unitList,
          hidden: true
        })
      }
    })
  },
  // // 获取奢侈品的分类的筛选
  getLuxuryBrandFilter () {
    api.luxuryBrandFilter({
      goodsBrand: this.data.kindCode
    }).then(data => {
      data.unitList.forEach(ele => {
        if (ele.name == this.data.money) {
          ele.isCheck = true
        } else {
          ele.isCheck = false
        }
      })
      this.setData({
        cateList: data.categoryList,
        unitList: data.unitList,
        hidden: true
      })
    })
  },
  // 改变币种 
  setMoney(e) {
    let obj = e.currentTarget.dataset;
    let unitList = this.data.unitList;
    if (unitList[obj.index].isCheck) {
      unitList[obj.index].isCheck = false;
      this.setData({
        unitList: unitList,
        unitCode: '',
        money: ''
      })
    } else {
      unitList.forEach(ele => {
        ele.isCheck = false
      })
      unitList[obj.index].isCheck = true;
      this.setData({
        unitList: unitList,
        unitCode: obj.code,
        money: obj.name
      })
    }
  },
  // 改变适用群体
  setSex (e) {
    let obj = e.currentTarget.dataset
    if (obj.name == this.data.sexName) {
      this.setData({
        sex: '',
        sexName: ''
      })
    } else {
      this.setData({
        sex: obj.sex,
        sexName: obj.name
      })
    }
  },
  // 改变时间
  setPicker(e) {
    let obj = e.currentTarget.dataset
    if (this.data.dateCode === obj.code) {
      this.setData({
        dateCode: '',
        picker: ''
      })
    } else {
      this.setData({
        dateCode: obj.code,
        picker: obj.name
      })
    }
  },
  // 改变分类
  setCate (e) {
    let obj = e.currentTarget.dataset;
    if (this.data.cateCode === obj.code) {
      this.setData({
        cateCode: '',
        cate: ''
      })
    } else {
      this.setData({
        cateCode: obj.code,
        cate: obj.name
      })
    }
  },
  // 改变品牌
  setBrand (e) {
    let obj = e.currentTarget.dataset
    if (obj.code == 'loadmorebrand') {
      wx.navigateTo({
        url: `/pages/moreBrands/moreBrands?categoryCode=${this.data.kindCode}&brand=${this.data.brand}`,
      })
    } else if (this.data.brandCode === obj.code) {
      this.setData({
        brandCode: '',
        brand: ''
      })
    } else {
      this.setData({
        brandCode: obj.code,
        brand: obj.name
      })
    }
  },
  // 修改品牌。 后端返回的name与code一致。brandCode单纯＋样式，进入筛选条件传递brand
  changeBrand (obj) {
    let brandList = this.data.brandList;
    let flag = brandList.some(item => {
      return item.code == obj.code
    })
    if (flag) {
      this.setData({
        brandCode: obj.code,
        brand: obj.name
      })
    } else { // 此判读是为了选择了更多品牌的之后的样式
      this.setData({
        brandCode: 'loadmorebrand',
        brand: obj.name
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  // 价格处理
  blurHandle(e) {
    if (e.currentTarget.dataset.differ == 'min') {
      this.setData({
        minPrice: e.detail.value
      })
    } else if (e.currentTarget.dataset.differ == 'max') {
      this.setData({
        maxPrice: e.detail.value
      })
    }
  },
  // 点击确定筛选条件
  confirm(e) {
    let max = this.data.maxPrice * 1
    let min = this.data.minPrice * 1
    if (max && (min> max)) {
      this.setData({
        maxPrice: min,
        minPrice: max
      })
    } else if (max && !min) {
      this.setData({
        maxPrice: max,
        minPrice: ''
      })
    }
    this.commonFun();
  },
  reset() {
    this.data.unitList.forEach(ele => {
      ele.isCheck = false
    })
    this.setData({
      unitList: this.data.unitList,
      money: '',
      picker: '',
      brand: '',
      cateCode: '',
      cate: '',
      sex: '',
      sexName: '',
      unitCode: '', // 币种
      dateCode: '', // 日期
      minPrice: '', // 最小价格
      maxPrice: '', // 最大价格
      brandCode: '' // 品牌
    })
  },
  commonFun () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.changeConditions(this.data.unitCode, this.data.minPrice, this.data.maxPrice, this.data.dateCode, this.data.cateCode, this.data.brand, this.data.money, this.data.cate, this.data.picker, this.data.sexName, this.data.sex);
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
})