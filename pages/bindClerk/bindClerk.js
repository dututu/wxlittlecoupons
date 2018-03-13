// pages/bindClerk/bindClerk.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    isShowToast:false,
    isChain:false,
    storeList:'',
    storeName:'选择门店',
    storeId:''
  },
  onLoad: function (e) {
    console.log(e)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                  _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                  common.setStorage('latitude', res.latitude)
                  common.setStorage('longitude', res.longitude)
                },

              })
            }
          })
        }
      }
    })
    let param = e.q
    let _this=this
    if (param) {
      var src = decodeURIComponent(param)
      console.log(src)
      var data = src.get_query('id')
      this.setData({
        id:data,
        unique_id: wx.getStorageSync('unique_id')
      })
      common.get('/storelist', {
        id: data,
      }).then(res => {
        _this.setData({
          isChain: true,
          storeList:res.data.storelist,
          storeId:0
        })
      }).catch(res => {
        //app.showToast(res.data.content || res.data.message, _this, 2000)
      })
    }
  },
  onShow:function(e) {
    console.log(e)
    let data;
   
    
  },
  bindStores:function(e) {
    console.log(e);
    let store = this.data.storeList[e.detail.value]
    this.setData({
      storeName:store.store_name,
      storeId:store.id
    })
  },
  // 页面加载的时候调取绑定核销员接口
  getBind: function () {
    let _this=this
    if(this.data.storeId===0) {
      app.showToast('请选择门店', _this, 2000)
      return;
    }
    common.get('/clerk/bind', {
      id: this.data.id,
      cid: this.data.unique_id,
      storeId:this.data.storeId
    }).then(res => {
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
    }).catch(res=>{
      app.showToast(res.data.content||res.data.message, _this, 2000)
    })
  },
})
