// pages/cancle/cancel.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id
    })
  },
  getBind: function () {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + this.data.id
    })
  }
})