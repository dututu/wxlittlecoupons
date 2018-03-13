// pages/mine/mine.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data:{
    user:{
      avatar:'../../imgs/default_head1.jpg',
      nickname:'匿名用户'
    }
  },
  isNeedAuth: true,
  show:false,
  isShowToast:false,
  onLoad:function(options){
    let that = this
    this.setData({
      unique_id: wx.getStorageSync('unique_id')
    })
    if (wx.getStorageSync('nickname')) {
      let userInfo = {
        avatar: wx.getStorageSync('avatar'),
        nickname: wx.getStorageSync('nickname')
      }
      this.setData({
        user: userInfo
      })
    }
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if(res.authSetting['scope.userInfo']==true) {
          that.setData({
            isNeedAuth:false
          })
          app.updateUsers(res, that)
        } else {
          that.setData({
            isNeedAuth: true
          })
        } 

        
      }
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
        person: res.data.total + res.data.second_num + res.data.third_num
      })
    })
  },
  onShow(){
    let that = this
    this.setData({
      unique_id: wx.getStorageSync('unique_id')
    })
    // 获取用户信息
    this.getUserInfo();
    // 获取我的总金额
    this.getMoney();
    // 获取传播总人数
    this.getPerson();
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (res.authSetting['scope.userInfo'] == true) {
          that.setData({
            isNeedAuth: false
          })
          app.updateUsers(res, that)
        } else {
          that.setData({
            isNeedAuth: true
          })
        }
      }
    })
  },
  // 获取用户信息
  getUserInfo(){
    common.post('/member/info',{
      unique_id: this.data.unique_id
    }).then(res=>{
      console.log(info);
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
  toAuth:function() {
    wx.navigateTo({
      url: '/pages/authorize/authorize',
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
  },
  getFormId: function (e) {
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    app.saveFormId(formid, uniqueid)
  },
})