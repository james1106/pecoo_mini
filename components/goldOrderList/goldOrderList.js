var app = getApp();
const api = require('../../utils/api.js');
Component({
  properties: {
    goldOrderList: Array,
  },
  methods: {
    // 申请售后
    callMe () {
      wx.makePhoneCall({
        phoneNumber: '400-1112-016'
      })
    },
    // 提醒发货
    remind () {
      setTimeout(() => {
        app.showToast('提醒发货成功', 'success')
      }, 200)
    },
    // 确认收货
    confirmGoods (e) {
      let that = this;
      api.receiveGoldGoods({
        orderId: e.currentTarget.dataset.id
      }).then(data => {
        app.showToast('确认收货成功', 'success', function () {
          that.triggerEvent('changeOrderStatus');
        })
      })
    },
    // 查看物流
    look (e) {
      let obj = e.currentTarget.dataset;
      console.log(obj)
      let content = '运单号：' + obj.expressno + '\r\n物流公司：' + obj.expresscompany;
      app.showErrorModal(content, '物流信息')
    },
  }
})