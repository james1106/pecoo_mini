
const app = getApp();
const host = app.globalData.host;
const searchHost = app.globalData.searchHost;
const recommendHost = app.globalData.recommendHost;

module.exports = (url = '', data = {}, type = 'GET', format) => {
  let headers = {
    'accessToken': wx.getStorageSync('userInfo').tokenId || '',
    'version': 'V1.0.0',
    'clientTime': new Date().getTime(),
    'sourceMode': 'MINI'
  };
  if (type == 'GET') {
    headers['content-type'] = 'application/json';
  } else {
    if (format == 'json') {
      headers['content-type'] = 'application/json';
    } else {
      headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: format == 'search' ? searchHost + url : format == 'recommend' ? recommendHost + url :host + url,
      method: type,
      data: data,
      header: headers,
      success: function (res) {
        if (res.statusCode == '200') {
          let code = res.data.code
          switch (code) {
            case '10000':
              resolve(res.data.result);
              break;
            case '10001':
              app.showErrorModal(res.data.msg)
              reject(res.data.result);
              break;
            case '40000':
              if (res.data.scode == '800001' || res.data.scode == '600001' || res.data.scode == '600002' || res.data.scode == '600008' ) {
                reject(res);
              } else {
                app.showErrorModal(res.data.msg);
                reject(res);
              }
              break;
            case '40003':
              wx.navigateTo({
                url: '/pages/login/login',
              })
              wx.removeStorageSync('userInfo');
              break;
            case '40004':
              app.showErrorModal(res.data.msg)
              reject(res.data.result);
              return false;
            case '40005':
              app.showErrorModal(res.data.msg)
              reject(res.data.result);
              return false;
            case '90000':
              app.showErrorModal(res.data.msg)
              reject(res.data.result);
              return false
          }
        } else if (res.statusCode == '500') {
          reject(res.data.result);
          app.showErrorModal('服务器开小差了～');
          return false
        }
      },
      fail: function (res) {
        console.log(res)
      }
    });
  });
}