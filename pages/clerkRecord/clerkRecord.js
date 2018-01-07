// pages/search/search.js
// pages/clerkPage/clerkPage.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    info: {},
    isShowToast: false,
    page: 0,
    has:false,
    total:'--',
    faceprice:'--',
    price:'--'
  },
  onLoad: function (e) {
    let _this = this
    if (wx.getStorageSync('unique_id')) {
      _this.setData({
        unique_id: wx.getStorageSync('unique_id')
      })
    }
    this.getCouponInfo();
    this.getCouponTotal();
  },
  getCouponTotal: function() {
    common.get('/coupon/couponusesum', {
      unique_id: this.data.unique_id,
    }).then(res => {
      console.log(res.data);
      this.setData({
        faceprice: res.data.coupon_money,
        price: res.data.coupon_price,
      }).catch(res => {
        
      })
    })
  },
  getCouponInfo: function () {
    common.get('/coupon/couponuse', {
      unique_id: this.data.unique_id,
      page: this.data.page
    }).then(res => {
      this.setData({
        info: res.data.data,
        has:true,
        total: res.data.meta.pagination.total
      }).catch(res=>{
        this.setData({
          has:false
        })
      })
    })
  },
  bindDownLoad() {
    this.data.page++
    this.setData({
      page: this.data.page
    })
    if (this.data.page > this.data.totalpage) {
      //已经达到最大页数
      return false;
    }
    common.get('/coupon/couponuse', {
      unique_id: this.data.unique_id,
      page: this.data.page
    }).then(res => {
      if (res.data.data.length > 0) {
        this.data.info = [...this.data.info, ...res.data.data]
        this.setData({
          info: this.data.info
        })
      } else {
        return false
      }
    })
  }
})