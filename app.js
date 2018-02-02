//app.js
// var aldstat = require("./utils/ald-stat.js");
let common = require('./assets/js/common.js');
import WxValidate from 'assets/js/WxValidate';//验证函数
App({
  data:{
    currentClickNavIndex:0
  },
  onLaunch: function (options) {
    wx.authorize({
      scope: 'scope.userInfo',
    })
  },
  onShow: function (options) {
    let that = this
    try {
      var value = wx.getStorageSync('unique_id')
      if (value != '') {
        wx.checkSession({
          success: function () {
            //已经登录
            console.log('已经登录')
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.userInfo']) {
                  wx.authorize({
                    scope: 'scope.userInfo',
                    success: function () {
                      let res = { 'authSetting': { 'scope.userInfo': true } }
                      that.updateUsers(res, that)
                    }
                  })
                } else {
                  that.updateUsers(res, that)
                }
              }
            })
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
    let id,type
    let that = this
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
          console.log(r);
          wx.setStorageSync('unique_id', r.data.data.data)
          wx.setStorageSync('session_key', r.data.data.session_key)
          wx.getSetting({
            success(res) {
              console.log(res);
              if (!res.authSetting['scope.userInfo']) {
                wx.authorize({
                  scope: 'scope.userInfo',
                  success:function() {
                    let res = { 'authSetting': {'scope.userInfo':true}}
                    that.updateUsers(res,that)
                  }
                })
              } else {
                let res = { 'authSetting': { 'scope.userInfo': true } }
                that.updateUsers(res, that)
              }
            }
          })
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
          })
        },
      })
    }
  },
  updateUsers:function(res,that) {
    console.log(22222)
    if (res.authSetting['scope.userInfo'] == true) {
      wx.getUserInfo({
        success: function (res) {
          //更新用户信息
          console.log('更新用户信息')
          common.post('/member/save', {
            user_id: wx.getStorageSync('unique_id'),
            session_key: wx.getStorageSync('session_key'),
            iv: res.iv,
            encryptedData: res.encryptedData
          }).then(data => {
            wx.setStorageSync('nickname', data.data.data.nickname)
            wx.setStorageSync('avatar', data.data.data.avatar)
            wx.setStorageSync('cbqrcode', data.data.data.cbqrcode)
            that.setData({
              user: data.data.data,
              isNeedAuth: false
            })
            
          })
        }
      })
    }
  },
  //用户登录信息
  checkSetting:function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope.userLocation'] === false) {
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  getCurrentDate:function() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let dateStr = date.getFullYear()+'.'+month+'.'+strDate
    return dateStr;
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