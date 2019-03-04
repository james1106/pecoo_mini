App({
  onLaunch: function (options) {
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
      },
    })
  },
  isLoginGo () {
    const api = require('utils/api.js');
    return api.isLogin({}).then(data => {
      if (data == 'Y') { // 表示已经超时
        wx.removeStorageSync('userInfo');
        return false
      } else {
        return true
      }
    })
  },
  getUserInfo(success, fail) {
    const api = require('utils/api.js');
    let that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res_user) {
              api.getUserInfo({
                code: res.code,
                encryptedData: res_user.encryptedData,
                iv: res_user.iv
              }).then(data => {
                success(data)
              })
            },
            fail: function (err) {
              fail(err)
            }
          })
        }
      }
    })
  },
  // 处理首页 and 奢侈品页跳转
  handleJump (gotoUrl, gotoId, gotoType, gotoKind) {
    switch (gotoType) {
      case 1: 
        wx.navigateTo({
          url: `/pages/webviewPage/webviewPage?url=${gotoUrl}`,
        });
        break;
      case 2: 
        switch (gotoKind * 1) {
          case 1: // 拍品
            wx.navigateTo({
              url: `/pages/detail/detail?id=${gotoId}`
            })
            break;
          case 2: // 文章视频
          case 3: // 拍品分类页
            if (gotoId.length > 3) {
              wx.navigateTo({
                url: `/pages/list/list?code=${gotoId}&title=商品列表`,
              })
            } else {
              wx.navigateTo({
                url: `/pages/lists/lists?code=${gotoId}&title=商品列表`,
              })
            }
            break;
          case 4: // 奢侈品
            wx.navigateTo({
              url: `/pages/extravagancesDetail/extravagancesDetail?id=${gotoId}`,
            })
            break;
          case 5: // 拍卖会场
            wx.navigateTo({
              url: `/pages/saleList/saleList?id=${gotoId}`,
            })
            break;
          case 6: // 拍卖行详情
            wx.navigateTo({
              url: `/pages/auctionHouseDetail/auctionHouseDetail?id=${gotoId}`,
            })
            break;
          case 7: // 奢侈品分类
            wx.navigateTo({
              url: `/pages/list/list?code=${gotoId}&type=12&title=商品列表`,
            })
            break;
          case 8: // 奢侈品品牌
            wx.navigateTo({
              url: `/pages/list/list?code=${gotoId}&type=15&title=商品列表`,
            })
            break;
        }
      case 3:
        break;
    }
  },
  // 错误弹框，确定按钮
  showErrorModal: function (content, title) {
    wx.showModal({
      title: title || '提示',
      content: content,
      showCancel: false,
      confirmColor: '#1A191E',
      success: function (res) {
        return false;
      }
    })
  },
  // 展示提示信息，只有内容，2秒消失
  showToast: function (content, status, success) {
    wx.showToast({
      title: content,
      icon: status ? status : 'none',
      duration: 2000,
      success: function () {
        success && success()
      }
    })
  },
  // 带有确定/取消按钮
  showModal: function (content, success, failed, confirmText = "确定", cancelText = "取消") {
    wx.showModal({
      title: '提示',
      content: content,
      confirmText: confirmText,
      cancelText: cancelText,
      success: function (res) {
        if (res.confirm) {
          success && success()
        } else if (res.cancel) {
          failed && failed()
        }
      }
    })
  },
  // 保留2位小数
  toDecimal2 (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  getUserId () {
    let userId = '';
    try {
      userId = wx.getStorageSync('userInfo').userId || '';
    } catch (e) {};
    return userId
  },
  getShareCode () {
    let shareCode = '';
    try {
      shareCode = wx.getStorageSync('userInfo').shareCode || '';
    } catch (e) {};
    return shareCode
  },
  globalData: {
    host: 'https://api.pecoo.com',
    searchHost: 'https://search.pecoo.com',
    recommendHost: 'https://recommend.pecoo.com',
    baseImageUrl: 'https://static.pecoo.com/images/',
  }
}) 