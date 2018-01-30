// pages/mineRecommend/mineRecommend.js
let common = require('../../assets/js/common');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    page:1,
    totalpage:1,
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
        let windowHeight = res.windowHeight*0.53
        that.setData({
          scrollHeight: windowHeight
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
  //保存海报
  savePoster: function() {
    let that = this
    wx.getImageInfo({
      src: '../../imgs/poster1.jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            app.showToast('海报生成成功，请进入系统相册查看', that, 2000)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
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
      this.setData({
        totalpage: res.data.meta.pagination.total_pages
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
  //下拉加载更多
  bindDownLoad(){
    this.data.page++
    this.setData({
      page: this.data.page
    })
    if(this.data.page>this.data.totalpage) {
      //已经达到最大页数
      return false;
    }
    common.get('/recommend',{
      unique_id: this.data.unique_id,
      page: this.data.page
    }).then(res=>{
      if (res.data.data.length > 0) {
        this.data.list = [...this.data.list, ...res.data.data]
        this.setData({
          list: this.data.list
        })
      } else {
        return false
      }
    })
  }
})