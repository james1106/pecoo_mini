var app = getApp();
const api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    checkedAll: false, // 全选
    loading: false,
    totalCount: 0, // 总数量
    pageSize: 10,
    pageNum: 1,
    currentTime: 0,
    renderData:[], // 页面渲染数据
    cateList: [
      {
        title: '拍卖会',
        type: '01',
        id: 0
      },
      {
        title: '拍卖行',
        type: '04',
        id: 1
      },
      {
        title: '拍品',
        type: '02',
        id: 2
      },
      {
        title: '奢侈品',
        type: '03',
        id: 3
      }
    ],
    baseImage: app.globalData.baseImageUrl,
    selected: 0,
    selectedType: '01', // 下拉是当前是那个type，需发送后端，与selected是一个意思，用重了，后期在改善
    edit: false, // 实现编辑和删除
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          height: res.windowHeight - 150
        })
      }
    })
  },
  // 改变头部分类
  changeCate(e) {
    let obj = e.currentTarget.dataset
    if (obj.index == this.data.selected) return;
    this.setData({
      selected: obj.index,
      selectedType: obj.type,
      checkedAll: false,
      pageNum: 1,
      edit: false,
      hidden: false
    })
    this.getMyCollection(obj.type)
  },
  // 获取收藏列表
  getMyCollection(colleType) {
    let that = this;
    api.collectionList({
      colleType: colleType,
      userId: app.getUserId(),
      pageSize: that.data.pageSize,
      pageNum: that.data.pageNum
    }).then(data => {
      data.pageResult.forEach(ele => {
        ele.checked = false
      })
      that.setData({
        renderData: data.pageResult,
        totalCount: data.totalCount,
        hidden: true
      })
    }).catch (err => {
      this.setData({
        hidden: false
      })
    })
  },
  //
  goPages (e) {
    if (!this.data.edit) {
      let id = e.currentTarget.dataset.id;
      if (this.data.selected == 0) {
        wx.navigateTo({
          url: `/pages/saleList/saleList?id=${id}`,
        })
      } else if (this.data.selected == 1) {
        wx.navigateTo({
          url: `/pages/auctionHouseDetail/auctionHouseDetail?id=${id}`,
        })
      } else if (this.data.selected == 2) {
        wx.navigateTo({
          url: `/pages/detail/detail?id=${id}`,
        })
      } else if (this.data.selected == 3) {
        wx.navigateTo({
          url: `/pages/extravagancesDetail/extravagancesDetail?id=${id}`,
        })
      }
    } else {
      let index = e.currentTarget.dataset.index;
      let arr = this.data.renderData;
      arr[index].checked = !arr[index].checked;
      let flag = arr.every(function (ele) {
        if (ele.checked) {
          return true
        } else {
          return false
        }
      })
      if (flag) {
        this.setData({
          renderData: this.data.renderData,
          checkedAll: true
        })
      } else {
        this.setData({
          renderData: this.data.renderData,
          checkedAll: false
        })
      }
    }
  },
  // 编辑
  edit () {
    this.setData({
      edit: true
    })
  },
  // 完成
  complete () {
    this.data.renderData.forEach(ele => {
      ele.checked = false
    })
    this.setData({
      edit: false,
      checkedAll: false,
      renderData: this.data.renderData
    })
  },
  // 改变全选状态
  changeAllChecked () {
    if (this.data.checkedAll) {
      this.data.renderData.forEach(ele => {
        ele.checked = false
      })
    } else {
      this.data.renderData.forEach(ele => {
        ele.checked = true
      })
    }
    this.setData({
      checkedAll: !this.data.checkedAll,
      renderData: this.data.renderData
    })
  },
  // 删除收藏
  del () {
    let that = this;
    let arr = []; // 要删除的id
    let brr = []; // 留下的数据
    that.data.renderData.forEach(ele => {
      if (ele.checked) {
        arr.push(ele.id)
      } else {
        brr.push(ele)
      }
    })
    if (arr.length) {
      app.showModal('您确定要取消收藏吗？', function () {
        api.delUserCollection({
          userId: app.getUserId(),
          goodsIds: arr.join(',')
        }).then(data => {
          that.setData({
            renderData: brr,
            totalCount: that.data.totalCount - arr.length,
            edit: false
          })
        })
      }, function () {
        console.log('用户点击取消')
      })
    } else {
      app.showToast('您还未选中')
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
    this.setData({
      pageNum: 1,
      currentTime: new Date().getTime()
    })
    this.getMyCollection(this.data.cateList[this.data.selected].type);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.edit) return;
    if (this.data.renderData.length >= this.data.totalCount) return;
    this.setData({
      loading: true
    })
    api.collectionList({
      colleType: this.data.selectedType,
      userId: app.getUserId(),
      pageSize: this.data.pageSize,
      pageNum: ++this.data.pageNum
    }).then(data => {
      data.pageResult.forEach(ele => {
        ele.checked = false
      })
      this.setData({
        renderData: this.data.renderData.concat(data.pageResult),
        pageNum: data.pageNum,
        loading: false
      })
    })
  },
})