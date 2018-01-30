// pages/xieyi/xieyi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    
    
  },
  drawCode:function() {
    let ctx = wx.createCanvasContext('headCanvas')
    wx.getImageInfo({
      src: 'http://file.wehome.com.cn/coupons/1517301673wjqz.png',
      success: function (res) {
        ctx.drawImage(res.path, 830, 1150, 170, 170)
        ctx.draw(true)
      }
    })
    
  },
  convertHead:function() {
    let that = this
    let ctx = wx.createCanvasContext('headCanvas')
    wx.getImageInfo({
                    src:'https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJlRulD9Hu3V6tffqX4YW3l48AfY0mmoG9DicJVCzjM1bYzsEYz1Dgolbqb2V9MkA5YwndvYAxpGTw/0',
      success: function (res) {
        console.log(res)
        ctx.beginPath()
        ctx.arc(50, 50, 50, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(res.path, 0, 0,100,100)
        ctx.draw(true,function(e) {
            wx.canvasToTempFilePath({
              canvasId: 'headCanvas',
              success: function (res) {
                let ctx = wx.createCanvasContext('firstCanvas')
                ctx.drawImage(res.tempFilePath, 80, 650, 100, 100)
                ctx.draw(true)
              }
            })
          }
        )
      }
    })
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
    let that = this
    let ctx = wx.createCanvasContext('firstCanvas')
    ctx.drawImage('../../imgs/poster1.jpg', 0, 0, 1079, 1364)
    ctx.draw(true)
    ctx.setFontSize(32)
    ctx.fillText('OM', 218, 660)
    ctx.draw(true)
    ctx.setFontSize(30)
    ctx.fillText('2018.01.29 正在【附近优惠券】平台邀请您免费发放优惠券', 186, 705)
    ctx.draw(true)
    this.convertHead()
    this.drawCode()
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