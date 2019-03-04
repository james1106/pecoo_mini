const app = getApp();
Component({
  properties: {
    appParams: String
  },
  data: {
    baseImg: app.globalData.baseImageUrl
  },
  methods: {
    // 未打开app， app未在用户手机上安装/打开失败
    launchAppError(e) {
      console.log(e)
      app.showErrorModal('打开失败，请查看是否安装拍库APP')
    },
  }
})