// pages/shopIndex/shopIndex.js
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'1300rpx',
    alert:false,
    maskShow:false,
    storeInfo:[],
    host: common.fileUrl,
    commentInfo: [],
    showCoupon:false,
    comment_page:1,
    comment_totalpage:0
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
          height:res.screenHeight+'px'
        })
      }
    })
    this.getShopInfo(options.id) 
    this.getComments(options.id)
  },
  getShopInfo:function(id) {
    common.get('/storeInfo', {
      store_id: id
    }).then(res => {
      this.setData({
        storeInfo:res.data.data,
        storeId:res.data.data.id
      })
    })
  },
  getComments:function(id) {
    common.get('/storeComments', {
      store_id: id,
      page: this.data.comment_page,
      unique_id: wx.getStorageSync('unique_id'),
    }).then(res => {
      this.data.commentInfo = [...this.data.commentInfo, ...res.data.data];
      this.setData({
        commentInfo: this.data.commentInfo,
        comment_totalpage: res.data.meta.pagination.total_pages,
        comment_page: this.data.comment_page + 1, 
        commentCount: res.data.meta.pagination.total,
      })
      
    })
  },
  nextPage: function () {
    let id = this.data.storeId
    if (this.data.comment_page <= this.data.comment_totalpage)
      this.getComments(id)
    else
      console.log('没有了');
  },
  selfGet:function() {
    wx.showModal({
      title: '认领说明',
      content: '我是这家门店的店主，确认认领？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showAlert: function () {
    this.setData({
      alert: true,
      maskShow: true,
    })
  },
  hideAlet: function () {
    this.setData({
      alert: false,
      maskShow: false,
    })
  },
  reGet:function() {
    this.showAlert();
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