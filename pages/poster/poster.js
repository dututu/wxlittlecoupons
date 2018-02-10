// pages/poster/poster.js
var app = getApp()
let common = require('../../assets/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posterBtn:false,
    showPost:false,
    poster:'',
    autoJump:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getAdd: function () {
    console.log('海报图片');
    let that = this
    common.post('/poster', {
      type: 2,
    }).then(res => {
      if (res.data.data[0].status == 2) {
        that.setData({
          posterBtn: true,
          poster: res.data.data[0].imgurl,
          showPost: true,
          showTime: res.data.data[0].carousel_time
        })
      } else {
        that.setData({
          poster: res.data.data[0].imgurl,
          showPost: true,
          showTime: res.data.data[0].carousel_time
        })
      }
      setTimeout(function () {
        if (that.data.autoJump) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {

        }
      }, that.data.showTime)
    }).catch(res => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    })
  },
  closePoster: function (e) {
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    let that = this
    app.saveFormId(formid, uniqueid)
    clearInterval()
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onLoad: function (options) {
    wx.hideShareMenu({})
    let that = this
    try {
      let res = wx.getSystemInfoSync()
      this.setData({
        x: res.windowWidth,
        y: res.windowHeight
      })
    } catch (e) {
      // Do something when catch error
    }
    this.getAdd()
    
  },
  getFirstPoster: function (e) {
    this.makePoster2(e);
  },
  //通用画图
  drawCode2: function () {
    console.log(11111111111);
    let ctx = wx.createCanvasContext('firstCanvas')
    let that = this
    let code = wx.getStorageSync('cbqrcode')
    let head = wx.getStorageSync('avatar')
    console.log('画图了吗')
    wx.getImageInfo({
      src: code,
      success: function (res) {
        ctx.drawImage(res.path, 850, 1150, 170, 170)
        ctx.draw(true, function (e) {
          wx.canvasToTempFilePath({
            canvasId: 'firstCanvas',
            success: function (res) {
              that.savePoster2(res.tempFilePath)
              that.setData({
                posterUrl: res.tempFilePath
              })
            }
          })
        })
      }
    })
  },
  convertHead2: function () {
    let that = this
    let ctx = wx.createCanvasContext('headCanvas')
    let head = wx.getStorageSync('avatar')
    if (head) {
      wx.getImageInfo({
        src: head,
        success: function (res) {
          console.log(res)
          ctx.beginPath()
          ctx.arc(50, 50, 50, 0, 2 * Math.PI)
          ctx.clip()
          ctx.drawImage(res.path, 0, 0, 100, 100)
          ctx.draw(true, function (e) {
            wx.canvasToTempFilePath({
              canvasId: 'headCanvas',
              success: function (res) {
                let ctx = wx.createCanvasContext('firstCanvas')
                ctx.drawImage(res.tempFilePath, 80, 1020, 100, 100)
                ctx.draw(true)
                console.log('画二维码')
                that.drawCode2()
              }
            })
          }
          )
        }
      })
    } else {
      that.drawCode2()
    }
  },
  makePoster2: function (e) {
    console.log(e)
    this.setData({
      autoJump:false
    })
    //画图
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    let that = this
    app.saveFormId(formid, uniqueid)
    app.showToast('正在生成海报，请稍候...', this, 3000)
    let ctx = wx.createCanvasContext('firstCanvas')
    let name = wx.getStorageSync('nickname')
    let date = app.getCurrentDate()
    wx.getImageInfo({
      src: that.data.poster,
      success: function (res) {
        console.log(res.path)
        ctx.drawImage(res.path, 0, 0, 1079, 1364)
        ctx.draw(true)
        console.log('画背景')

        ctx.setFontSize(30)
        ctx.fillText(date + ' 正在【附近优惠券】平台分享优惠券', 186, 1115)
        ctx.draw(true)
        if (name) {
          ctx.setFontSize(32)
          ctx.fillText(name, 218, 1070)
          ctx.draw(true)

          //头像
          console.log('画头像')
          that.convertHead2()
        } else {
          that.drawCode2()
        }
      }
    })


    //二维码
  },
  getPoster2: function (url) {
    wx.getImageInfo({
      src: url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showModal({
              title: '海报已保存到系统相册',
              content: '快去分享给朋友，叫伙伴们来围观吧',
              confirmText: '我知道了',
              showCancel: false,
              success: function (res) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
          },
          fail(res) {
            app.showToast('海报生成失败，请重试', that, 3000)
            console.log(res)
          }
        })
      }
    })
  },
  //保存海报
  savePoster2: function (url) {
    let that = this
    this.hideShare()
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('授权成功')
          that.getPoster2(url)
        } else {
          console.log('授权失败')

          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('再次授权成功')
              that.getPoster2(url)
            },
            fail() {
              wx.navigateTo({
                url: '/pages/authorize/authorize',
              })
            }
          })
        }
      }
    })
  },
  hideShare: function () {
    this.setData({
      showMask: false
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