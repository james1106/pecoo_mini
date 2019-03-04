const app = getApp()
const api = require('../../utils/api.js');
let pics = [];
let oldPics = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    disable: false,
    id: '',
    back: '',
    positiveIdNo: '', // 正面
    oppositeIdNo: '', // 反面
    username: '',
    idCard: ''
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
    pics = [];
    if (options.id) {
      api.currentInfo({
        id: options.id,
        userId: app.getUserId(),
      }).then(data => {
        this.setData({
          id: options.id,
          username: data.realName,
          idCard: data.idCardNum,
          positiveIdNo: data.frontPhotoUrl,
          oppositeIdNo: data.backPhotoUrl
        })
        oldPics[0] = data.frontPhotoUrl;
        oldPics[1] = data.backPhotoUrl;
      })
    }
  },
  onUnload: function () {
    pics = []
  },
  changeUsername (e) {
    this.setData({
      username: e.detail.value
    })
  },
  changeIdCard (e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  // 上传身份证
  uploadFile (e) {
    let that = this;
    wx.authorize({
      scope: 'scope.camera', // 先进行用户授权
      success() { // 调用手机方法
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            if (e.currentTarget.dataset.position == 'positive') {
              that.setData({
                positiveIdNo: res.tempFilePaths[0]
              })
              pics[0] = res.tempFilePaths[0]
              oldPics[0] = '' // 编辑图片时，把当前面的值清空。
            } else {
              that.setData({
                oppositeIdNo: res.tempFilePaths[0]
              })
              pics[1] = res.tempFilePaths[0]
              oldPics[1] = ''
            }
          },
        })
      }
    })
  },
  tips () {
    app.showToast('上传身份证成功', 'success', function () {
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    })
  },
  save () {
    let that = this;
    if (!this.data.username) {
      return app.showErrorModal('请输入您的姓名!');
    } else if (!this.data.idCard) {
      return app.showErrorModal('请输入您的身份证!');
    } else if (!this.data.positiveIdNo) {
      return app.showErrorModal('请上传您的身份证正面');
    } else if (!this.data.oppositeIdNo) {
      return app.showErrorModal('请上传您的身份证反面');
    }
    if (!this.data.disable) {
      this.setData({
        disable: true
      })
      if (oldPics.length) {
        if (!oldPics[0] && oldPics[1]) {
          wx.uploadFile({
            url: app.globalData.host + api.saveOrUpdate,
            filePath: pics[0],
            name: 'frontImage',
            header: {
              accessToken: wx.getStorageSync('userInfo').tokenId || '',
              version: 'V1.0.4',
              clientTime: new Date().getTime(),
              sourceMode: 'MINI'
            },
            formData: {
              'id': this.data.id,
              'realName': this.data.username,
              'idCardNum': this.data.idCard,
              'userId': app.getUserId(),
              'backImageUrl': oldPics[1],
            },
            success (res) {
              let data = JSON.parse(res.data)
              if (data.code == 10000) {
                console.log('success')
                that.tips()
              }
            },
            fail(err) {
              that.setData({
                disable: false
              })
            }
          })
        } else if (!oldPics[1] && oldPics[0]) {
          wx.uploadFile({
            url: app.globalData.host + api.saveOrUpdate,
            filePath: pics[1],
            name: 'backImage',
            header: {
              accessToken: wx.getStorageSync('userInfo').tokenId || '',
              version: 'V1.0.4',
              clientTime: new Date().getTime(),
              sourceMode: 'MINI'
            },
            formData: {
              'id': this.data.id,
              'realName': this.data.username,
              'idCardNum': this.data.idCard,
              'userId': app.getUserId(),
              'frontImageUrl': oldPics[0],
            },
            success(res) {
              let data = JSON.parse(res.data)
              if (data.code == 10000) {
                console.log('success')
                that.tips()
              }
            },
            fail (err) {
              that.setData({
                disable: false
              })
            }
          })
        } else if (!oldPics[1] && !oldPics[0]) {
          this.uploadimg({
            url: app.globalData.host + api.saveOrUpdate,
            path: pics,
            formObj: {
              'realName': this.data.username,
              'idCardNum': this.data.idCard,
              'userId': app.getUserId(),
              'id': this.data.id,
            }
          })
        } else {
          api.saveName({
            'id': this.data.id,
            'realName': this.data.username,
            'idCardNum': this.data.idCard,
            'userId': app.getUserId(),
            'frontImageUrl': oldPics[0],
            'backImageUrl': oldPics[1]
          }).then(data => {
            that.tips()
          }).catch(err => {
            that.setData({
              disable: false
            })
          })
        }
      } else {
        console.log('2')
        this.uploadimg({
          url: app.globalData.host + api.saveOrUpdate,
          path: pics,
          formObj: {
            'realName': this.data.username,
            'idCardNum': this.data.idCard,
            'userId': app.getUserId(),
            'id': this.data.id,
          }
        })
      }
    }
  },
  // 此方法只是添加新的清关证件使用
  uploadimg (data) {
    var obj = data;
    var that = this;
    var i = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i] && data.path[i],
      name: i ? 'backImage' : 'frontImage',
      header: {
        accessToken: wx.getStorageSync('userInfo').tokenId || '',
        version: 'V1.0.4',
        clientTime: new Date().getTime(),
        sourceMode: 'MINI'
      },
      formData: data.formObj,
      success: (res) => {
        let datas = JSON.parse(res.data);
        if (datas.code == '10000') {
          success++;
          obj.formObj.id = datas.result.id
        } else {
          fail++;
          app.showToast(datas.msg);
          that.setData({
            disable: true
          })
        }
      },
      fail: (res) => {
        fail++;
        that.setData({
          disable: false
        })
      },
      complete: () => {
        i++;
        if (i == data.path.length & !fail) {
          that.tips()
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(obj);
        }
      }
    });
  }
})