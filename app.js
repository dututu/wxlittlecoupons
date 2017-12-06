//app.js
// var aldstat = require("./utils/ald-stat.js");
App({
  data:{
    currentClickNavIndex:0
  },
  getUserInfo: function (cb, success, userinfo, complete){
    var that = this
    if(this.globalData.userInfo){
      if(typeof success == "function") {
        success({}, { userInfo: this.globalData.userInfo, user: this.globalData.userInfo, data: this.globalData.data})
      }else{
        typeof cb == "function" && cb(this.globalData.userInfo)
      }
    }else{
      //调用登录接口
      wx.login({
        success: function (data) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              that.globalData.data = data,
                that.globalData.user = res.userInfo
              res.data = data
              typeof success == "function" && success(data,res)
            },
            fail(){
              wx.getSetting({
                    success: (res) => {
                      if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope.userLocation'] === false) {
                        wx.navigateTo({
                          url: '/pages/authorize/authorize',
                        })
                      }
                    }
                  }) 
            }
            // complete: function () {
            //   wx.getLocation({
            //     type: 'wgs84',
            //     success: function (res) {
            //       wx.setStorageSync('latitude', res.latitude)
            //       wx.setStorageSync('longitude', res.longitude)
            //     },
            //     complete(){
            //       wx.getSetting({
            //         success: (res) => {
            //           if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope.userLocation'] === false) {
            //             wx.navigateTo({
            //               url: '/pages/authorize/authorize',
            //             })
            //           }
            //         }
            //       }) 
            //     }
            //   })
            // }
          })
        },
      })
    }
  },
  showToast: function (text, o, count) {
    var _this = o; count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({
      toastText: text,
      isShowToast: true,
    });
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, count);
  },
  globalData:{
    userInfo:null
  }
})