// pages/bindClerk/bindClerk.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    isShowToast:false,
    isChain:true
  },
  onLoad: function (e) {
    console.log(e)
    
    let param = e.q
    let _this=this
    if (param) {
      var src = decodeURIComponent(param)
      var data = src.get_query('id')
      this.setData({
        id:data,
        unique_id: wx.getStorageSync('unique_id')
      })
      
    }
    console.log(11111111111);
  },
  onShow:function(e) {
    console.log(e)
    let data;
    common.get('storelist', {
      id: data,
    }).then(res => {
      console.log(res)
    }).catch(res => {
      app.showToast(res.data.content || res.data.message, _this, 2000)
    })
    
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
