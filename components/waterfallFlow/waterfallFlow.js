var leftList = new Array(); // 左侧集合
var rightList = new Array(); // 右侧集合
var leftHight = 0, rightHight = 0;
let windowWidth = 0;
Component({
  properties: {
    listData: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        let _boxWidth = 0;
        wx.getSystemInfo({
          success: function (res) {
            _boxWidth = res.windowWidth / 2 - 20; // 盒子宽度
          }
        })
        leftList = []
        rightList = []
        leftHight = 0
        rightHight = 0;        
        newVal.forEach((ele, index) => {
          if (ele.imageInfo != null && ele.imageInfo != '') {
            let curImageInfo = JSON.parse(ele.imageInfo);
            let scaleVal = _boxWidth * curImageInfo.height / curImageInfo.width // 比例值
            if (leftHight <= rightHight) {
              leftList.push(ele)
              leftHight = leftHight + scaleVal + 72.5
            } else {
              rightList.push(ele)
              rightHight = rightHight + scaleVal + 72.5
            }
          } else {
            let scaleVal = _boxWidth * 375 / 375 // 比例值
            if (leftHight <= rightHight) {
              leftList.push(ele)
              leftHight = leftHight + scaleVal + 72.5
            } else {
              rightList.push(ele)
              rightHight = rightHight + scaleVal + 72.5
            }
          }
        });
        this.setData({
          leftList: leftList,
          rightList: rightList
        })
      }
    }
  },
  data: {
    leftList: [],
    rightList: []
  },
})