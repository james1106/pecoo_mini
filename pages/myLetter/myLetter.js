var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messagesList: [],
    totalCount: 0,
    startX: 0,
    startY: 0,
    loadMore: false,
    pageNo: 1,
    pageSize: 10,
    hidden: false,
    isDel: true,
    baseImg: app.globalData.baseImageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessageList();
  },
  // 获取站内信
  getMessageList () {
    api.queryMessageList({
      userId: app.getUserId(),
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize
    }).then(data => {
      data.pageResult.forEach(ele => {
        ele.isTouchMove = false
      })
      this.setData({
        messagesList: this.data.messagesList.concat(data.pageResult),
        totalCount: data.totalCount,
        hidden: true,
        loadMore: false
      })
    })
  },

  touchMove: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let startX = that.data.startX;
    let startY = that.data.startY;
    let touchMoveX = e.changedTouches[0].clientX; // 滑动变化坐标
    let touchMoveY = e.changedTouches[0].clientY; // 滑动变化坐标
    let angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.messagesList.forEach(function (v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 30) return; // 滑动超过30度角 return
      if (i == index) {
        if (touchMoveX > startX){
          v.isTouchMove = false
        } else {
          v.isTouchMove = true
        }
      }
    })
    that.setData({
      messagesList: that.data.messagesList
    })
  },

  angle (start, end) {
    let _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  touchStart: function (e) {
    this.data.messagesList.forEach(ele => {
      if (ele.isTouchMove) {
        ele.isTouchMove = true
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      messagesList: this.data.messagesList
    })
  },
  // 删除站内信
  delMessage (e) {
    if (this.data.isDel) {
      this.setData({
        isDel: false
      })
      let obj = e.currentTarget.dataset;
      api.delMessage({
        id: obj.id,
        userId: app.getUserId(),
      }).then(data => {
        let messagesList = this.data.messagesList
        messagesList.splice(obj.index, 1)
        this.setData({
          messagesList: messagesList,
          isDel: true
        })
        app.showToast('删除成功', 'success')
      })
    }
  },

  changeStatus (index) {
    let messagesList = this.data.messagesList;
    messagesList[index].messageState = '02';
    this.setData({
      messagesList: messagesList
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
    this.data.messagesList.forEach(ele => {
      ele.isTouchMove = false
    })
    this.setData({
      messagesList: this.data.messagesList
    })
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
    if (this.data.messagesList.length == this.data.totalCount) return;
    this.setData({
      pageNo: ++this.data.pageNo,
      loadMore: true,
    })
    this.getMessageList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})