var app = getApp();
const api = require('../../utils/api.js')
Page({
  data: {
    tokenId:'',
    currentTab: 0, //预设当前项的值
    duihuanTan: false,
    pageNo: 1,
    baseImg: 'https://www.pecoo.com/pecooh5/img/',
    voucherList: [],
    hidden:false,
    voucherVal: '',
    voucherType: ''
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
      duihuanTan: false
    });
    this.onLoad();
  },
  onLoad: function () {
    this.setData({
      tokenId: wx.getStorageSync('tokenId'),
      hidden: false
    })
    let queryVoucher = api.queryVoucherUrl({
      userId: app.globalData.userId,
      tokenId: this.data.tokenId,
      voucherType: "02",
      state: '0' + (this.data.currentTab*2 + 2)
    });
    queryVoucher.then((res) => {
      if (res.code == "0000") {
        this.setData({
          voucherList: res.voucherList,
          hidden:true
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  //激活弹框
  jihuo() {
    this.setData({
      duihuanTan: true
    })
  },
  //激活代金券
  exchange() {
    var that = this;
    let convertVoucher = api.convertVoucherUrl({
      sourceMode: app.globalData.sourceMode,
      tokenId: this.data.tokenId,
      voucherProvideState: "02",
      voucherCode: this.data.voucherVal
    });
    convertVoucher.then((res) => {
      console.log(res)
      if (res.code == "0000") {
        if (res.voucherType == '01') {
          wx.showModal({
            title: '提示',
            content: '代金券兑换成功',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: `/pages/voucher/voucher`
                });
              } else if (res.cancel) {

              }
            }
          })
        } else if (res.voucherType == '02') {
          wx.showModal({
            title: '提示',
            content: '保证金券兑换成功',
            success: function (res) {
              if (res.confirm) {
                that.onLoad();
                this.setData({
                  duihuanTan: false
                })
              } else if (res.cancel) {

              }
            }
          })
        }
      } else {
        return app.showErrorModal(res.message);
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  // 更改switchTab
  switchTab (e) {
    let curFlag = e.currentTarget.dataset.flag
    this.setData({
      currentTab: curFlag
    })
    this.onLoad()
  },
  // input的blur事件
  voucherInput: function (e) {
    this.setData({
      voucherVal: e.detail.value
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
    console.log("下拉");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  lower() {
    this.setData({
      hasRefesh: true,
    });
    //console.log(this.data.pageNo)
    if (!this.data.hasMore) return;
    let queryVoucher = api.queryVoucherUrl({
      sourceMode: app.globalData.sourceMode,
      tokenId: this.data.tokenId,
      pageNo: ++this.data.pageNo,
      voucherType: "02",
      state: '0' + (this.data.currentTab + 2)
    });
    queryVoucher.then((res) => {
      this.setData({
        voucherList: this.data.voucherList.concat(res.voucherList),
        hidden: true,
        hasRefesh: false,
      })
    }).catch((error) => {
      console.log(error)
    })
  },
  /**
 * 用户点击右上角分享
 */
  // onShareAppMessage: function () {

  // }
})