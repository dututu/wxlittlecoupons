// pages/redPac/redPac.js
var WxParse = require('../../wxParse/wxParse.js');
let common = require('../../assets/js/common');
Page({
  data: {},
  onLoad: function (options) {
    common.get('/coupon/red').then(res => {
      if (res.data.data.code == 200) {
        var article = res.data.data.content
        var that = this;
        WxParse.wxParse('article', 'html', article, that, 20);
      } else if (res.data.data.code == 403) {
        wx.showToast({
          title: '当前页面没有编辑内容',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})