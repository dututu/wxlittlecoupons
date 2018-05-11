// pages/shop/shop.js
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    storeList:[],
    total_pages:0,
    allCoupon:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          height: res.screenHeight + 'px'
        })
      }
    })
    this.storeList()
  },
  storeList:function(e) {
    common.get('/storeLists', {
      lng: wx.getStorageSync('longitude'),
      lat: wx.getStorageSync('latitude'),
      id: wx.getStorageSync('unique_id'),
      page: this.data.page
    }).then(res => {
      this.data.storeList = [...this.data.storeList, ...res.data.data];
      this.setData({
        storeList: this.data.storeList,
        total_pages: res.data.meta.pagination.total_pages,
        host: common.fileUrl,
        page: this.data.page+1
      })
    })
  },
  likeStore:function(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    common.post('/like', {
      id: wx.getStorageSync('unique_id'),
      store_id: e.currentTarget.dataset.storeid,
    }).then(res => {
      if(res.code==1)
        this.data.storeList[index].islike = 1
      else 
        this.data.storeList[index].islike = 0
    })
  },
  todetail:function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/shopIndex/shopIndex?id=' + e.currentTarget.dataset.id
    })
  },
  nextPage: function() {
    if (this.data.page <= this.data.total_pages)
      this.storeList()
    else 
      console.log('没有了');
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})