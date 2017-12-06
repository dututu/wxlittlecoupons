// pages/submit/submit.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  // 点击完成跳转到首页
  jumpIndex: function (e) {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
})