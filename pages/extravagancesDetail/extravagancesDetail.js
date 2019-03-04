var app = getApp();
const api = require('../../utils/api.js');
const colleType = '03';
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    ymbPrice: '', // 约合人民币
    luxuryGood: {}, // 当前奢侈品的对象
    maxPriceRMB: '',
    minPriceRMB: '', 
    maxPrice: '',
    minPrice: '',
    curPrice: '',
    isDiscount: '', // 是否是折扣商品
    priceRate: '', // 当前汇率
    banners: [], // 轮播图
    colorList: [], // 颜色
    sizeList: [], // 大小
    detailPics: [], // 商品详情的图片
    curColor: '', // 当前选中的颜色
    curSize: '', // 当前选中的大小
    maskFlag: false,
    isTranslate: true,
    animationData: {},
    voiceUrl: '', // 语音播报地址
    voiceFlag: false, // 语音
    isCollection: 'N', // 收藏
    loveData: [],
    num: 1,
    likeList: [],
    access_token: '', // 百度Api得token
    isShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isShare) {
      wx.removeStorageSync('shareCode');
    }
    let that = this;
    if (options.shareCode) {
      wx.setStorageSync('shareCode', options.shareCode);
    }
    // 获取百度api的token
    wx.request({
      url: api.getToken,
      success: function (res) {
        that.setData({
          access_token: res.data.access_token
        })
      }
    })
    // 监听语音播报结束
    innerAudioContext.onEnded(function () {
      that.setData({
        voiceFlag: false
      })
    })
    if (options.isShare == 'IOS' || options.isShare == 'android') {
      this.setData({
        isShare: true
      })
    }
    let luxuryLike = api.luxuryLike({
      id: options.id
    }).then(data => {
      return data
    })
    let luxuryGoodsDetail = api.luxuryGoodsDetail({
      userId: app.getUserId(),
      goodsId: options.id
    }).then(data => {
      return data
    })
    Promise.all([luxuryGoodsDetail, luxuryLike]).then(function (data) {
      let luxuryGood = data[0].luxuryGood;
      luxuryGood.price = app.toDecimal2(luxuryGood.price);
      luxuryGood.primaryPrice = app.toDecimal2(luxuryGood.primaryPrice);
      data[1].forEach(ele => {
        ele.price = app.toDecimal2(ele.price)
      })
      let appParams = `{"page": "lightDetail", "pkId":"${luxuryGood.id}"}`
      let colorSizeList = data[0].colorList;
      that.setData({
        isShare: options.isShare || '',
        hidden: true,
        banners: data[0].picList,
        ymbPrice: data[0].ymbPrice.toFixed(2),
        maxPrice: app.toDecimal2(data[0].maxPrice),
        minPrice: data[0].minPrice,
        maxPriceRMB: data[0].maxPriceRMB,
        minPriceRMB: data[0].minPriceRMB,
        curPrice: app.toDecimal2(data[0].maxPrice),
        colorList: colorSizeList || [],
        detailPics: data[0].detailPics,
        isDiscount: data[0].isDiscount,
        sizeList: (colorSizeList.length && colorSizeList[0].sizeList) || [],
        isCollection: data[0].isCollection,
        luxuryGood: luxuryGood,
        priceRate: data[0].priceRate,
        likeList: data[1],
        appParams: appParams
      })
    })
  },
  /**
   * 查看大图
   */
  lookBig (e) {
    let index = e.currentTarget.dataset.index;
    let banners = [];
    this.data.banners.forEach(ele => {
      banners.push(ele.bigPic)
    })
    wx.previewImage({
      current: banners[index],
      urls: banners,
    })
  },
  // 猜你喜欢进详情
  goDetail (e) {
    let pages = getCurrentPages();
    if (pages.length >= 10) {
      wx.redirectTo({
        url: '/pages/extravagancesDetail/extravagancesDetail?id=' + e.detail.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({ 
        url: '/pages/extravagancesDetail/extravagancesDetail?id=' + e.detail.currentTarget.dataset.id,
      })
    }
  },
  /**
   * 设置收藏
   */
  setCollection (e) {
    api.addUserCollection({
      'userId': app.getUserId(),
      'goodsId': e.currentTarget.dataset.id,
      'colleType': colleType
    }).then(data => {
      this.setData({
        isCollection: 'Y'
      })
      app.showToast('收藏成功');
    })
  },
  /**
   * 取消收藏
   */
  cancelCollection (e) {
    api.delUserCollection({
      'userId': app.getUserId(),
      'goodsIds': e.currentTarget.dataset.id,
      'colleType': colleType
    }).then(data => {
      this.setData({
        isCollection: 'N'
      })
      app.showToast('已取消收藏');
    })
  },
  /**
   * 选择颜色 or 尺寸的弹窗
   */
  showMask () {
    if (this.data.luxuryGood.inventoryNum) {
      this.setData({
        maskFlag: true
      })
      let animation = wx.createAnimation({
        duration: 500,  // 动画时长
        timingFunction: "ease", // 线性
      });
      this.animation = animation
      setTimeout(function () {
        this.fadeIn();//调用显示动画
      }.bind(this), 200)
    }
  },
  // 关闭弹窗
  hideMask () {
    let animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.fadeDown();
    setTimeout(function () {
      this.setData({
        maskFlag: false
      })
    }.bind(this), 720)
  },
  // 设置数量
  setNumber (e) {
    if (e.detail.value <= 1) {
      this.setData({
        num: 1
      })
    } else if (e.detail.value >= this.data.luxuryGood.inventoryNum){
      this.setData({
        num: this.data.luxuryGood.inventoryNum
      })
    } else {
      this.setData({
        num: e.detail.value
      })
    }
  },
  /**
   * 动画
   */
  fadeIn () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  fadeDown () {
    this.animation.translateY(500).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  /**
   * 改变选中的color
   */
  changeSelectedColor (e) {
    let obj = e.currentTarget.dataset;
    if (this.data.curColor == obj.color) return;
    if (obj.colorstock) {
      let sizeList = this.data.colorList[obj.index].sizeList;
      this.setData({
        curColor: obj.color,
        sizeList: sizeList,
        curSize: '',
        curPrice: app.toDecimal2(this.data.maxPrice)
      })
    }
  },
  /**
   * 改变选中的size
   */
  changeSelectedSize(e) {
    let obj = e.currentTarget.dataset;
    if (!this.data.curColor || obj.goodsextendstock) {
      this.setData({
        curSize: obj.size,
        curPrice: app.toDecimal2(obj.goodsextendprice)
      })
    }
  },
  /**
   * 改变数量
   */
  addNumber (e) {
    this.data.num++
    this.setData({
      num: this.data.num
    })
  },
  /**
   * 减少数量
   */
  reduceNumber(e) {
    if (this.data.num == 1) {
      wx.showToast({
        title: '已经是最小数量了',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.data.num--      
      this.setData({
        num: this.data.num
      })
    }
  },
  /**
   * 语音播放
   */
  voicePlay () {
    this.setData({
      voiceFlag: !this.data.voiceFlag
    })
    let content = ''
    let voiceUrl = `http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&ctp=1&tok=${this.data.access_token}&cuid=${app.getUserId() || '466df510f89e4e31806f8a0da9ea1542'}&tex=`
    if (!this.data.luxuryGood.goodsDescCh) {
      wx.showLoading({
        title: '语音合成中...'
      })
      api.luxuryTranslate({
        userId: app.getUserId(),
        goodsId: this.data.luxuryGood.id
      }).then(data => {
        let luxuryGood = this.data.luxuryGood;
        luxuryGood.goodsNameCh = data.goodsNameCh;
        luxuryGood.goodsDescCh = data.goodsDescCh;
        this.setData({
          luxuryGood: luxuryGood,
          isTranslate: true
        })
        innerAudioContext.src = voiceUrl + encodeURI(encodeURI(data.goodsDescCh));
        wx.hideLoading()
        if (this.data.voiceFlag) {
          innerAudioContext.play()
        } else {
          innerAudioContext.pause()
        }
      })
    } else {
      innerAudioContext.src = voiceUrl + encodeURI(encodeURI(this.data.luxuryGood.goodsDescCh));
      if (this.data.voiceFlag) {
        innerAudioContext.play()
      } else {
        innerAudioContext.pause()
      }
    }
  },
  /**
   * 翻译
   */
  translate () {
    this.setData({
      isTranslate: !this.data.isTranslate
    })
    if (!this.data.luxuryGood.goodsDescCh && !this.data.luxuryGood.goodsNameCh) {
      api.luxuryTranslate({
        userId: app.getUserId(),
        goodsId: this.data.luxuryGood.id
      }).then(data => {
        let luxuryGood = this.data.luxuryGood;
        luxuryGood.goodsNameCh = data.goodsNameCh;
        luxuryGood.goodsDescCh = data.goodsDescCh;
        this.setData({
          luxuryGood: luxuryGood
        })
      })
    }
  },
  call () {
    wx.makePhoneCall({
      phoneNumber: '4001112016',
    })
  },
  /**
   * 确认订单页
   */
  goConfirmOrder () {
    if (!this.data.curColor) {
      return app.showToast('请选择颜色')
    } else if (!this.data.curSize) {
      return app.showToast('请选择尺码')
    } else if (!this.data.num) {
      return app.showToast('请输入数量')
    }
    if (app.getUserId()) {
      api.isLogin({}).then(data => {
        if (data == 'Y') {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          wx.navigateTo({
            url: `/pages/extravagancesConfirmOrder/extravagancesConfirmOrder?id=${this.data.luxuryGood.id}&curColor=${this.data.curColor}&curSize=${this.data.curSize}&num=${this.data.num}&price=${this.data.luxuryGood.price}&&priceUnit=${this.data.luxuryGood.priceUnit}&curImage=${this.data.banners[0].bigPic}&goodsName=${this.data.luxuryGood.goodsName}`,
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    // api.isLogin({}).then(data => {
    //   if (data == 'Y') {
    //     wx.navigateTo({
    //       url: '/pages/login/login',
    //     })
    //   } else {
    //     wx.navigateTo({
    //       url: `/pages/extravagancesConfirmOrder/extravagancesConfirmOrder?id=${this.data.luxuryGood.id}&curColor=${this.data.curColor}&curSize=${this.data.curSize}&num=${this.data.num}&price=${this.data.luxuryGood.price}&&priceUnit=${this.data.luxuryGood.priceUnit}&curImage=${this.data.banners[0].bigPic}&goodsName=${this.data.luxuryGood.goodsName}`,
    //     })
    //   }
    // })
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
    innerAudioContext.pause()
    this.setData({
      maskFlag: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.pause()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.luxuryGood.goodsName,
      path: `/pages/extravagancesDetail/extravagancesDetail?id=${this.data.luxuryGood.id}&shareCode=${app.getShareCode()}`
    }
  }
})