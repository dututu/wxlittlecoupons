// pages/addClerk/addClerk.js
let common = require('../../assets/js/common');
Page({
  data:{
    clerkList:[],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 页面记载的时候获取到缓存中的openid
    this.setData({
      unique_id: wx.getStorageSync('unique_id'),
    })
    if (wx.getStorageSync('imgSrc')){
      this.setData({
        imgSrc: wx.getStorageSync('imgSrc')
      })
    }else {
      // 获取到添加核销员的二维码
      this.getCode();
    }
    // 获取到核销员列表
    this.getList();
  },
  // 页面记载的时候调取核销员列表接口
  getList:function(){
     common.get('/clerk/list',{
       unique_id: this.data.unique_id
     }).then(res=>{
       this.setData({
         clerkList:res.data.data
       })
     })
  },
  // 删除核销员方法
  getId:function(e){
    let _this=this
    let id=e.currentTarget.dataset.item.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗?',
      success: function (res) {
        if (res.confirm) {
          common.get('/clerk/delete', {
            id: id
          }).then(res => {
            _this.getList()
          })
        }
      }
    })
  },
//  获取到添加核销员的二维码
  getCode:function(){
    common.get('/clerk/code',{
      unique_id: this.data.unique_id
    }).then(res=>{
      this.setData({
        imgSrc:res.data.data
      })
      wx.setStorageSync('imgSrc',res.data.data)
    })
  }
})