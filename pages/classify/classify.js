const app = getApp();
const api = require('../../utils/api.js');
// 13 拍卖行 -- 14 拍卖会
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    classData: [],
    show: false,
    loading: false,
    listData: [],
    selectedType: '',
    selectedCode: '',
    scrollTop: 0,
    selectedName: '为你推荐', // 根据name来判断选中状态。
    baseImg: app.globalData.baseImageUrl,
    lettersData: [], // 拍卖会/拍卖行渲染的数据
    auctionTotalCount: 0, // 拍卖会的总数量
    auctionPageNum: 1, // 拍卖会的分页数量
    housePageNum: 1, // 拍卖行的分页数量
    houseTotalCount: 0, // 拍卖行的总数量
    totalData: [], // 总数据，二维
    windowHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    
  },
  onLoad: function (options) {
    let that = this;
    let firstCategory = api.firstCategory({
      userId: app.getUserId(),
    }).then(data => {
      return data.firstCategory
    });
    let parentCategory = api.parentCategory({
      userId: app.getUserId(),
      code: '000',
      type: '10',
      pageNum: '',
      pageSize: ''
    }).then(data => {
      return data
    });
    Promise.all([firstCategory, parentCategory]).then(function (data) {
      let length = data[0].length;
      for (let i = 0; i < length; i++) { // 根据1级分类计算得出多少数据；
        that.data.totalData.push({})
      }
      that.data.totalData.splice(0, 1, data[1])
      that.setData({
        classData: data[0],
        listData: data[1].data,
        cateBanner: data[1].banner || [],
        hidden: true
      })
    });
    try {
      let res = wx.getSystemInfoSync()
      // this.pixelRatio = res.pixelRatio
      // this.apHeight = 16
      // this.offsetTop = 80
      this.setData({ windowHeight: res.windowHeight - 44 + 'px' })
    } catch (e) {
      console.log(e)
    }
  },
  // 改变1级分类
  changeFirstCate (e) {
    if (this.data.selectedCate == e.currentTarget.dataset.code) return
    let obj = e.currentTarget.dataset
    this.setData({
      selectedName: obj.name,
      selectedType: obj.type,
      selectedCode: obj.code,
      scrollTop: 0,
      loading: false,
      show: (obj.type == 13 || obj.type == 14) ? true : false, // 用来决定拍卖会/拍卖行的展示
    })
    if (this.data.totalData[obj.index].data) {
      let currentData = this.data.totalData[obj.index];
      if (obj.type == 13 || obj.type == 14) {
        this.setData({
          lettersData: currentData.data.children
        })
      } else {
        this.setData({
          cateBanner: currentData.banner || [],
          listData: currentData.data
        })
      }
    } else {
      this.setData({
        hidden: false        
      })
      api.parentCategory({
        userId: app.getUserId(),
        code: e.currentTarget.dataset.code,
        type: e.currentTarget.dataset.type,
        pageNum: (obj.type == 13 || obj.type == 14) ? 1 : '',
        pageSize: (obj.type == 13 || obj.type == 14) ? 20 : ''
      }).then(data => {
        this.data.totalData.splice(obj.index, 1, data);
        if (obj.type == 13) {
          console.log(data.children)
          this.setData({
            houseTotalCount: data.data.totalCount || 0,
            lettersData: data.data.children || [],
            hidden: true
          })
        } else if (obj.type == 14) {
          this.setData({
            auctionTotalCount: data.data.totalCount,
            lettersData: data.data.children,
            hidden: true
          })
        } else {
          this.setData({
            cateBanner: data.banner || [],
            listData: data.data,
            totalData: this.data.totalData,
            hidden: true
          })
        }
      })
    }
  },
  load (e) {
    console.log(e)
  },
  loadmore () {
    this.setData({
      loading: true
    })
    if (this.data.selectedType == 13) {
      console.log(this.data.lettersData.length, this.data.houseTotalCount)
      if (this.data.lettersData.length >= this.data.houseTotalCount) {
        this.setData({
          loading: false
        })
        return false
      }
      api.parentCategory({
        userId: app.getUserId(),
        code: this.data.selectedCode,
        type: this.data.selectedType,
        pageNum: ++this.data.housePageNum,
        pageSize: 20
      }).then(data => {
        this.setData({
          lettersData: this.data.lettersData.concat(data.data.children),
          housePageNum: data.data.pageNum,
          laoding: false
        })
      })
    } else {
      if (this.data.lettersData.length >= this.data.auctionTotalCount) {
        this.setData({
          loading: false
        })
        return false
      };
      api.parentCategory({
        userId: app.getUserId(),
        code: this.data.selectedCode,
        type: this.data.selectedType,
        pageNum: ++this.data.auctionPageNum,
        pageSize: 20
      }).then(data => {
        this.setData({
          lettersData: this.data.lettersData.concat(data.data.children),
          auctionPageNum: data.data.pageNum,
          laoding: false
        })
      })
    }
  }
})