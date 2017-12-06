// pages/success/success.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  jumpMine: function () {
    wx.switchTab({
      url: '/pages/mine/mine'
    })
  }
})