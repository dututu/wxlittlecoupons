// pages/mine/mine.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data:{},
  show:false,
  isShowToast:false,
  onLoad:function(options){
    this.setData({
      unique_id: wx.getStorageSync('unique_id')
    })
    // 获取我的总金额
    this.getMoney();
    // 获取总人数
    this.getPerson();
  },
  // 获取传播总人数
  getPerson(){
    common.get('/membernum',{
      unique_id: this.data.unique_id
    }).then(res=>{
      this.setData({
        person: res.data.member_num + res.data.shop_num
      })
    })
  },
  onShow(){
    // 获取用户信息
    this.getUserInfo();
    // 获取我的总金额
    this.getMoney();
    // 获取传播总人数
    this.getPerson();
  },
  // 获取用户信息
  getUserInfo(){
    common.post('/member/info',{
      unique_id: this.data.unique_id
    }).then(res=>{
      this.setData({
        user:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取我的总金额
  getMoney(){
    common.get('/totalamount',{
      unique_id: this.data.unique_id
    }).then(res=>{
      this.setData({
        totalMoney: res.data.total_amount
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 跳转到金钱页面
  jumpMoney(){
    wx.navigateTo({
      url: '/pages/money/money'
    })
  },
  // 跳转到营销页面
  jumpSale(){
    wx.navigateTo({
      url: '/pages/mineRecommend/mineRecommend'
    })
  }
})