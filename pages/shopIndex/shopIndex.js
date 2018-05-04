// pages/shopIndex/shopIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'1300rpx',
    alert:false,
    maskShow:false,
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