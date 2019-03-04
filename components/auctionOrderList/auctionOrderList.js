var app = getApp();
const bidRule = require('../../utils/bidRule.js');
const api = require('../../utils/api.js');
Component({
  properties: {
    auctionOrderList: {
      type: Array
    },
    curStatus: Number
  },
  data: {
    animationData: {}, // 动画
    showRecommendPrice: false,
    disable: false, // 防止二次下单
    disableReduce: false, // 禁止减
    recommendList: [],
    modifyIndex: '',
    modifyId: '', // 修改报价的id
    modifyPrice: '', // 当前修改报价的价格
    maxPrice: '', // 当前最高报价
  },
  methods: {
    // 修改  修改报价
    modify (e) {
      let obj = e.currentTarget.dataset
      this.setData({
        modifyId: obj.id,
        modifyPrice: obj.price,
        maxPrice: obj.price > obj.maxprice ? obj.price : obj.maxprice,
        modifyIndex: obj.index
      })
    },
    // 取消  修改报价
    cancelModify () {
      this.setData({
        modifyId: ''
      })
    },
    // input change事件
    changeNumber (e) {
      this.setData({
        modifyPrice: e.detail.value
      })
    },
    // 去订单详情
    goOrderDetail (e) {
      if (this.data.modifyId != e.currentTarget.dataset.id) {
        wx.navigateTo({
          url: `/pages/auctionOrderDetail/auctionOrderDetail?orderId=${e.currentTarget.dataset.id}`,
        })
      }
    },
    // 增加报价
    add (e) {
      let maxPrice = e.currentTarget.dataset.maxprice;
      let priceVal = bidRule.addMoney(this.data.modifyPrice);
      this.setData({
        modifyPrice: priceVal,
        disableReduce: false
      })
    },
    // 减少报价
    reduce (e) {
      let obj = e.currentTarget.dataset
      let unit = obj.unit;
      let maxPrice = obj.maxprice; // 当前最高价格（字段的）
      let clientPrice = obj.clientprice; // 当前成交价
      let priceVal = bidRule.reduceMoney(this.data.modifyPrice);
      if (priceVal < maxPrice) {
        this.setData({
          disableReduce: true
        })
        return app.showToast('您的出价金额必须高于' + obj.unit + maxPrice)
      }
      this.setData({
        modifyPrice: priceVal
      })
    },
    // 选择报价
    setPrice (e) {
      if (this.data.modifyPrice == e.currentTarget.dataset.variable) return
      this.setData({
        showRecommendPrice: false,
        modifyPrice: e.currentTarget.dataset.variable
      })
      this.updateOrder();
    },
    // 动画隐藏
    hideMask () {
      let animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
      })
      this.animation = animation
      this.animation.translateY(500).step()
      this.setData({
        animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
      })
      setTimeout(function () {
        this.setData({
          showRecommendPrice: false,
        })
      }.bind(this), 720)
    },
    // 修改报价
    changePrice (e) {
      let obj = e.currentTarget.dataset;
      let oldPrice = parseFloat(this.data.maxPrice); // 目前最高价
      let money = this.data.modifyPrice;		//输入的价格
      if (!money) {
        return app.showToast('请输入价格！');
      }
      let reg = /^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
      if (!reg.test(money)) {
        return app.showToast('请输入正确的数字！');
      };
      money = parseFloat(money);
      if (oldPrice == "") {
        oldPrice = 0;
      }
      if (money != 0) {
        let list = new Array();
        let maxlist = new Array();
        list = bidRule.recommendMoney(money);
        for (var i = 0; i < list.length; i++) {
          if (money == list[i]) {
            break;
          } else if (money < list[i]) {
            maxlist.push(list[i]);
          }
        }
        if (maxlist.length > 0) {
          if (maxlist.length > 3) {
            for (var i = 0; i < 3; i++) {
              maxlist = maxlist.slice(0, 3)
            }
          } else {
            for (var i = 0; i < maxlist.length; i++) {
              maxlist = maxlist.slice(0, maxlist.length + 1)
            }
          }
          let animation = wx.createAnimation({
            duration: 500,  // 动画时长
            timingFunction: "ease", // 线性
          });
          this.animation = animation
          setTimeout(function () {
            this.animation.translateY(0).step()
            this.setData({
              animationData: this.animation.export()
            })
          }.bind(this), 200)
          this.setData({
            recommendList: maxlist,
            showRecommendPrice: true
          })
          return false;
        }
      }
      this.updateOrder();
    },
    // 更新订单状态
    updateOrder() {
      if (this.data.disable) return;
      this.setData({
        disable: true
      })
      let auctionOrderList = this.data.auctionOrderList;
      auctionOrderList[this.data.modifyIndex].clientPrice = this.data.modifyPrice;
      api.updateAuctionOrder({
        userId: app.getUserId(),
        orderId: this.data.modifyId,
        clientPrice: this.data.modifyPrice
      }).then(data => {
        this.setData({
          modifyId: '',
          showRecommendPrice: false,
          auctionOrderList: auctionOrderList,
          disable: false
        })
        this.triggerEvent('changeOrderStatus');
        app.showToast('修改报价成功！');
      }).catch(err => {
        this.hideMask()
        this.setData({
          showRecommendPrice: true,
          disable: false
        })
      })
    },
    // 取消订单
    cancelOrder (e) {
      let that = this;
      app.showModal('您确定要取消订单吗？', function () {
        if (this.data.disable) return;
        this.setData({
          disable: true
        })
        api.cancelAuctionOrder({
          userId: app.getUserId(),
          orderId: e.currentTarget.dataset.id
        }).then(data => {
          app.showToast('取消订单成功', 'success', function () {
            that.setData({
              disable: false
            })
            that.triggerEvent('changeOrderStatus');
          })
        })
      }.bind(this), function () {
        console.log('取消取消订单')
      }.bind(this))
    },
    // 确认收货
    confirmGoods (e) {
      if (this.data.disable) return;
      let that = this;
      this.setData({
        disable: true
      })
      api.receiveAuctionGoods({
        userId: app.getUserId(),
        orderId: e.currentTarget.dataset.id
      }).then(data => {
        app.showToast('确认收货成功', 'success', function () {
          let auctionOrderList = that.data.auctionOrderList;
          that.triggerEvent('changeOrderStatus');
          that.setData({
            disable: false
          })
        })
      })
    },
    // 去支付
    goPay (e) {
      let obj = e.currentTarget.dataset;
      if (obj.paymentstatus == '05') {
        wx.navigateTo({
          url: `/pages/payFreight/payFreight?orderId=${obj.id}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/confirmOrder/confirmOrder?orderId=${obj.id}`,
        })
      }
    },
    // 查看物流
    lookLogistics(e)  {
      wx.navigateTo({
        url: '/pages/lookExpress/lookExpress?orderId=' + e.currentTarget.dataset.id,
      })
    },
  }
})