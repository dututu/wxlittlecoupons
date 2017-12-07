// pages/mineRecommend/mineRecommend.js
let common = require('../../assets/js/common');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    page:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    this.setData({
      page:1
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.setData({
      unique_id: wx.getStorageSync('unique_id')
    })
    // 获取传播二维码
    this.getUserCode()
    // 获取推荐用户人数
    this.getPersonNum()
    // 获取推荐列表
    this.getList()
  },
  previewImage: function (e) {
    wx.previewImage({
      urls: this.data.code.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    })
  }, 
  // 获取传播二维码
  getUserCode(){
    common.get('/member/recommendCode',{
      id: this.data.unique_id
    }).then(res=>{
      this.setData({
        code:res.data.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取推荐列表
  getList(){
    common.get('/recommend',{
      unique_id: this.data.unique_id
    }).then(res=>{
      this.setData({
        list:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取推荐用户人数
  getPersonNum(){
    common.get('/membernum',{
      unique_id: this.data.unique_id
    }).then(res=>{
      this.setData({
        numObj:res.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 下拉加载更多
  // bindDownLoad(){
  //   this.data.page++
  //   this.setData({
  //     page: this.data.page
  //   })
  //   common.get('/recommend',{
  //     unique_id: this.data.unique_id
  //   }).then(res=>{
  //     if (res.data.data.length > 0) {
  //       this.data.list = [...this.data.list, ...res.data.data]
  //       this.setData({
  //         list: this.data.list
  //       })
  //     } else {
  //       return false
  //     }
  //   })
  // }
})