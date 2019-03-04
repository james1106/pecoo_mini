var app = getApp();
const api = require('../../utils/api.js')
var b = true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    packagesInfo: [
      {
        name: '拍卖行',
      },
      {
        name: '境外中转站',
      },
      {
        name: '海关',
      },
      {
        name: '目的地',
      }
    ],
    currentProcess: 0, // 当前高亮的步骤
    progressBeanList: [],
    hidden:false,
    type: '', // 当时是奢侈品 / 拍品物流
    infos: [] // 详情信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'luxury') {
      api.luxuryExpress({
        userId: app.getUserId(),
        orderId: options.orderId
      }).then(data => {
        let packagesInfo = this.data.packagesInfo;
        data.progressBeanList.forEach(ele => {
          let time = ele.time;
          ele.hours = time.substring(11)
          ele.date = time.substring(0, 10)
          ele.infos = [] // 物流的详情信息
          ele.flag = false
        })
        this.setData({
          progressBeanList: data.progressBeanList,
          hidden: true,
          packagesInfo: packagesInfo,
          type: options.type
        })
      })
    } else {
      api.lookExpressInfo({
        userId: app.getUserId(),
        orderId: options.orderId
      }).then(data => {
        let packagesInfo = this.data.packagesInfo;
        data.progressBeanList.forEach(ele => {
          let time = ele.time;
          ele.hours = time.substring(11)
          ele.date = time.substring(0, 10)
          ele.infos = [] // 物流的详情信息
          ele.flag = false
        })
        let currentProcess = this.data.currentProcess;
        if (data.warehouse == 'DIRECT') { // 不显示境外中转站
          packagesInfo.splice(1, 1);
          if (data.orderStatus == '30') {
            currentProcess = 2
          } else if (data.currentNode == 'AUCTION') {
            currentProcess = 0
          } else if (data.currentNode == 'CUSTOMS') {
            currentProcess = 1
          }
        } else {
          if (data.orderStatus == '30') {
            currentProcess = 3;
          } else if (data.currentNode == 'AUCTION') {
            currentProcess = 0;
          } else if (data.currentNode == 'TRANSFER') {
            currentProcess = 1;
          } else if (data.currentNode == 'CUSTOMS') {
            currentProcess = 2;
          } else if (data.currentNode == 'NATIONAL') {
            currentProcess = 99
          }
        }
        this.setData({
          progressBeanList: data.progressBeanList,
          hidden: true,
          packagesInfo: packagesInfo,
          currentProcess: currentProcess
        })
      })
    }
  },
  getExpressInfo (e) {
    let obj = e.currentTarget.dataset;
    if (obj.cansearch == 'Y') {
      let progressBeanList = this.data.progressBeanList
      if (progressBeanList[obj.index].flag) {
        progressBeanList[obj.index].flag = false;
        this.setData({
          progressBeanList: progressBeanList
        })
      } else {
        if (progressBeanList[obj.index].infos.length) {
          progressBeanList[obj.index].flag = true;
          this.setData({
            progressBeanList: progressBeanList
          })
        } else {
          this.setData({
            hidden: false
          })
          api.getExpressInfo({
            expressCompany: obj.expresscompany,
            expressNumber: obj.expressnumber
          }).then(data => {
            let progressBeanList = this.data.progressBeanList;
            progressBeanList[obj.index].infos = data.infos;
            progressBeanList[obj.index].flag = true
            this.setData({
              progressBeanList: progressBeanList,
              hidden: true
            })
            }).catch(err => {
              this.setData({
                hidden: true
              })
            })
        }
      }
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
})
