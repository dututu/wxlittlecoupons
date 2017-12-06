// pages/authorize/authorize.js
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
    if (this.checkAuthStatus) return
    this.checkAuthStatus = true
    wx.openSetting({
      success: (res) => {
        
      }
    })
  },
})