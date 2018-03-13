// pages/clerkPage/clerkPage.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    info: {},
    isShowToast:false
  },
  onLoad: function (e) {
    let _this = this;
    let param=e.q
    if(param){
      var src = decodeURIComponent(param)
      var data = src.get_query('id')
      this.setData({
        id: data
      })
      console.log(this.data.id)
      app.getUserInfo(function(e,res){},function(e,res){
        e=e||{},
        e.code=e.code||res.data.code
        _this.setData({
          img: res.userInfo.avatarUrl,
          name: res.userInfo.nickName,
        })
        if (wx.getStorageSync('unique_id')){
          _this.setData({
            unique_id: wx.getStorageSync('unique_id')
          })
          _this.getCouponInfo();
        }else {
          common.post('/member/handle', {
            code:e.code,
            encryptedData: res.encryptedData,
            iv:res.iv
          }).then(unique_id=>{
            _this.setData({
              unique_id: unique_id.data.data.data
            })
            wx.setStorageSync('unique_id', _this.data.unique_id)
            _this.getCouponInfo()
          })
        }
      })
    }else {
      app.showToast(res.data.content || res.data.message, _this, 2000)
    }
  },
  // 点击核销执行的函数
  clerk: function () {
    let _this=this
    common.get('/order/confirm', {
      unique_id: this.data.unique_id,
      orderid: this.data.id
    }).then(res => {
      wx.showModal({
        title: '提示',
        content: res.data.data.content,
        success: function (res) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
    getCouponInfo: function(){
      common.get('/order/over', {
        id: this.data.id,
      }).then(res => {
        this.setData({
          info: res.data.data
        })
      })
    },
  
  
})