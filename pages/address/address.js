var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allAddress:[],
    hidden: false,
    showAdd: false,  
    back: '',
    height: 0, // 地址小于10得高度
    maxHeight: 0,
    baseImg: app.globalData.baseImageUrl
  },
  clickAddress (e) {
    if (this.data.back) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.changeAddressAndIdCard(this.data.allAddress[e.currentTarget.dataset.index])
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    try {
      const res = wx.getSystemInfoSync()
      console.log()
      that.setData({
        height: res.windowHeight - 75,
        maxHeight: res.windowHeight,
        back: options.back || ''
      })
    } catch (e) {
      // Do something when catch error
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
      hidden: false
    })
    api.queryUserAddressList({
      userId: app.getUserId(),
    }).then(data => {
      this.setData({
        hidden: true,
        allAddress: data.pageResult
      })
    })
  },
  //点击默认地址
  defaultAddress(event){
    let obj = event.currentTarget.dataset;
    let that = this
    if (obj.status == 'Y') return;
    api.updateUserAddress({
      id: obj.variable,
      userId: app.getUserId(),
      isDefault: 'Y',
      sourceMode: app.globalData.sourceMode,
      province: that.data.allAddress[obj.index].province,
      city: that.data.allAddress[obj.index].city,
      area: that.data.allAddress[obj.index].county,
      zipCode: that.data.allAddress[obj.index].zipCode,
      detailAddress: that.data.allAddress[obj.index].detailAddress,
      recipientName: that.data.allAddress[obj.index].recipientName,
      phone: that.data.allAddress[obj.index].phone,
    }).then(data => {
      app.showToast('设置成功', 'success', function () {
        that.data.allAddress.forEach(ele => {
          ele.isDefault = 'N'
        })
        that.data.allAddress[obj.index].isDefault = 'Y'
        that.setData({
          allAddress: that.data.allAddress
        })
      })
    })
  },
  // 删除地址
  deleteAddressCha (event) {
    let that = this;
    let obj = event.currentTarget.dataset;
    app.showModal('您确定删除吗？', function () {
      api.delUserAddress({
        userId: app.getUserId(),
        id: obj.variable
      }).then(data => {
        that.data.allAddress.splice(obj.index, 1);
        that.setData({
          allAddress: that.data.allAddress
        })
        if (that.data.back) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.reviceAlladdress(that.data.allAddress)
        }
      })
    }, function () {
      console.log('用户取消删除')
    })
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
    
  },
  
})
