// pages/search/search.js
let common = require('../../assets/js/common');
Page({
  data: {
    infoList: [],
    searchValue: '',
  },
  onLoad: function (options) {
    var that = this
    let res = wx.getSystemInfoSync()
    that.setData({
      scrollStyle: {
        width: res.windowWidth,
        height: res.windowHeight
      }
    })
    that.setData({
      unique_id: wx.getStorageSync('unique_id'),
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude')
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  search: function (e) {
    let search = e.detail.value;
    common.post('/search', {
      id: this.data.unique_id,
      search: search,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }).then(res => {
      this.setData({
        infoList: res.data.data
      })
    })
  },
  doSearch: function (e) {
    let search = e.detail.value.search
    common.post('/search', {
      id: this.data.unique_id,
      search: search,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }).then(res => {
      this.setData({
        infoList: res.data.data
      })
    })
  },
  // 获取到当前点击的优惠券的id
  getId: function (e) {
    let id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  }
})