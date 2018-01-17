//app.js
// var aldstat = require("./utils/ald-stat.js");
let common = require('./assets/js/common.js');
import WxValidate from 'assets/js/WxValidate';//验证函数
App({
  data:{
    currentClickNavIndex:0
  },
  onLaunch: function (options) {
    console.log('app框架加载时候');
    console.log(options);
    let that = this
    try {
      var value = wx.getStorageSync('unique_id')
      if (value!='') {
        wx.checkSession({
          success: function () {
            //已经登录
          },
          fail: function () {
            that.login(options);
          }
        })
      } else {
        that.login(options);
      }
    } catch (e) {
      that.login(options)
    }
  },
  login: function (options) {
    console.log('app框架加载时候');
    console.log(options);
    let id,type
    if(options.query.q!=undefined) {//扫码进来的
      let src = decodeURIComponent(options.query.q)
      console.log(src)
      id =  src.get_query('member_id') || src.get_query('id') || ''
      type = src.get_query('status') || 1
    
    } else {
      id = options.query.member_id || ''
      type = options.query.status || 1
    }
    
    wx.login({
      success: function (res) {
        //登录提前
        common.post('/member/login', {
          code: res.code,
          id: id,
          type: type
        }).then(r => {
          wx.setStorageSync('unique_id', r.data.data.data)
          wx.setStorageSync('session_key', r.data.data.session_key)
        })
      }
    }) 
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
      wx.login({
        success: function (data) {
      //调用登录接口
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
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages)
})