// pages/authorize/authorize.js
var app = getApp()
let common = require('../../assets/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 进行授权
  quan(){
    let that = this
    if (this.checkAuthStatus) return
    this.checkAuthStatus = true
    wx.openSetting({
      success: (res) => {
        app.updateUsers(res,that);
      },
      fail:(res)=> {
        console.log('失败');
        console.log(res)
      }
    })
  },
})