// pages/bindClerk/bindClerk.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    isShowToast:false
  },
  onLoad: function (e) {
    let param = e.q
    let _this=this
    if (param) {
      var src = decodeURIComponent(param)
      var data = src.get_query('id')
      this.setData({
        id:data
      })
      if (wx.getStorageSync('unique_id')){
        console.log('有unique_id')
        this.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
      }else {
        console.log('重新获取unique_id')
        app.getUserInfo(function (e, res) { }, function (e, res) {
          e = e || {}
          e.code = e.code || res.data.code
          common.post('/member/handle', {
            code: e.code,
            encryptedData: res.encryptedData,
            iv: res.iv
          }).then(unique_id => {
            _this.setData({
              unique_id: unique_id.data.data.data
            })
            wx.setStorageSync('unique_id', _this.data.unique_id)
          })
        })
      }
    }
  },
  // 页面加载的时候调取绑定核销员接口
  getBind: function () {
    let _this=this
    common.get('/clerk/bind', {
      id: this.data.id,
      cid: this.data.unique_id
    }).then(res => {
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
    }).catch(res=>{
      app.showToast(res.data.content||res.data.message, _this, 2000)
    })
  },
})
