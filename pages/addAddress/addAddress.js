var app = getApp();
const api = require('../../utils/api.js')
var model = require('../../model/model.js')
var show = false;
var item = {};
Page({
  data: {
    item: {
      show: show
    },
    baseImg: app.globalData.baseImageUrl,
    back: '', // 回传数据
    recipientName: '',
    phone: '',
    zipCode: '',
    province:'',
    city:'',
    county:'',
    detailAddress:'',
    switchValue:'N',
    pkId:'',
    switchTF:'',
    disabled: false,
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  onShow:function(){
    
  },
  recipientNameInput: function (e) {
    this.setData({
      recipientName: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  zipCodeInput: function (e) {
    this.setData({
      zipCode: e.detail.value
    })
  },
  detailAddressInput: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  switchChange: function (e) {
    this.setData({
      switchValue: e.currentTarget.dataset.checkval
    })
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
    if (!this.data.province){
      this.setData({
        province: '北京市',
        city: '市辖区',
        county:'东城区'
      });
    }
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  saveClick(){
    let that = this;
    var reg = /^[a-zA-Z0-9]+$/;
    if (!this.data.recipientName) {
      return app.showErrorModal('收货人不能为空');
    }
    if (!this.data.phone) {
      return app.showErrorModal('手机号码不能为空');
    }
    if (!this.data.zipCode || !reg.test(this.data.zipCode)) {
      return app.showErrorModal('请输入正确的邮政编码');
    }
    if (!this.data.county) {
      return app.showErrorModal('地区必须精确到所在区');
    }
    if (!this.data.detailAddress) {
      return app.showErrorModal('详细地址不能为空');
    }
    if (!this.data.disabled) {
      this.setData({
        disabled: true
      })
      if (this.data.pkId) {
        api.updateUserAddress({
          id: this.data.pkId,
          userId: app.getUserId(),
          province: this.data.province,
          city: this.data.city,
          area: this.data.county,
          zipCode: this.data.zipCode,
          detailAddress: this.data.detailAddress,
          recipientName: this.data.recipientName,
          phone: this.data.phone,
          isDefault: this.data.switchValue
        }).then(data => {
          app.showToast('修改地址成功', 'success', function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              this.setData({
                disabled: false
              })
            }.bind(this), 1000)
          })
        })
      } else {
        api.saveUserAddress({
          userId: app.getUserId(),
          province: this.data.province,
          city: this.data.city,
          area: this.data.county,
          zipCode: this.data.zipCode,
          detailAddress: this.data.detailAddress,
          recipientName: this.data.recipientName,
          phone: this.data.phone,
          isDefault: this.data.switchValue,
        }).then(data => {
          app.showToast('添加地址成功', 'success', function () {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
              that.setData({
                disabled: false
              })
            }, 1000)
          })
        }).catch( err => {
          that.setData({
            disabled: false
          })
        })
      }
    }
  },
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
    if (options.recipientName){
      this.setData({
        recipientName: options.recipientName,
        phone: options.phone,
        zipCode: options.zipCode,
        pkId: options.pkId,
        province: options.province,
        city: options.city,
        county: options.area,
        detailAddress: options.detailAddress,
        switchValue: options.isDefault
      });
    }
    if (options.isDefault == "Y"){
      this.setData({
        switchTF:true
      })
    }
  },
  onReachBottom: function () {
  }
})