// pages/mineCoupon/mineCoupon.js
let common = require('../../assets/js/common');
Page({
  data: {
    currentTab: 0,
    infoList: [],
    num: {},
    pageList: [{
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }],
    info: [],
    unShow:false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    // 页面加载的时候获取到openid
    common.getStorage('openid').then(res => {
      this.setData({
        openid: res.data
      })
      // 页面加载的时候获取数据
      this.getData();
      // 页面加载的时候获取到三种状态的个数
      this.getNum();
    })
  },
  // 点击tab栏切换页面
  swichNav: function (e) {
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    if (this.data.info[parseInt(e.target.dataset.current)] && this.data.info[parseInt(e.target.dataset.current)].length > 0) {
      this.setData({
        infoList: this.data.info[this.data.currentTab]
      })
      return false;
    }
    this.getData();
  },
  // 请求页面信息
  reqInfo(status, page = 1, cb) {
    common.get('/coupon/mycoupon', {
      openid: this.data.openid,
      status: status,
      page: page
    }).then(res => {
      cb.call(this, res)
    })
  },
  // 页面加载的时候，获取的数据
  getData: function () {
      if (!this.data.info[parseInt(this.data.currentTab)] || this.data.info[parseInt(this.data.currentTab)].length == 0) {
         this.reqInfo(parseInt(this.data.currentTab) + 1, this.data.pageList[this.data.currentTab].page, res =>{
           if (res.data.data.length > 0) {
                this.data.pageList[this.data.currentTab].page = res.data.meta.pagination.current_page
            } else {
                this.data.pageList[this.data.currentTab].total = res.data.meta.pagination.current_page
            }
            this.data.pageList[this.data.currentTab].page = res.data.meta.pagination.total_pages
            if(!this.data.info[this.data.currentTab])this.data.info[this.data.currentTab] = [];
            this.data.info[this.data.currentTab] = [... this.data.info[this.data.currentTab],...res.data.data]
            
            this.setData({
                info:this.data.info,
                pageList: this.data.pageList,
                infoList: this.data.info[parseInt(this.data.currentTab)]
            })
         })
      }
  },
  // 页面下拉的时候执行这个函数
  bindscrolltoupper: function () {
      this.reqInfo(parseInt(this.data.currentTab) + 1, this.data.pageList[parseInt(this.data.currentTab)].page, res => {
        if(this.data.pageList[parseInt(this.data.currentTab)].page <= res.data.meta.pagination.total_pages)
        this.data.pageList[parseInt(this.data.currentTab)] = {
          page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
          total: res.data.meta.pagination.total_pages
        }
        this.data.info[parseInt(this.data.currentTab)] = [...this.data.info[parseInt(this.data.currentTab)], ...res.data.data];
        this.setData({
          pageList: this.data.paeList,
          info: this.data.info,
          infoList: this.data.info[parseInt(this.data.currentTab)]
        })
      })
  },
   clearData() {
        this.setData({
            pageList: [{
                page: 1,
                total: null
            }, {
                page: 1,
                total: null
            }, {
                page: 1,
                total: null
            }],
            info: []
        })
    },
  // 获取我的优惠券三种状态的个数
  getNum: function () {
    let _this=this
    common.get('/coupon/mycoupon_allnum', {
      openid: this.data.openid
    }).then(res => {
      this.setData({
        num: res.data
      })
      if(res.data.overtime==0&&res.data.unused==0&&res.data.used==0){
        this.setData({
          unShow:true
        })
      }
    })
  },
  // 跳转到详情页的函数
  jumpDetail: function (e) {
    let id = e.currentTarget.dataset.item.coupon_id;
    wx.navigateTo({
      url: '/pages/detail1/detail1?id=' + id
    })
    common.setStorage('isShow', 1)
  },
  jumpDetail1: function (e) {
    let id = e.currentTarget.dataset.item.coupon_id;
    wx.navigateTo({
      url: '/pages/detail1/detail1?id=' + id
    })
    common.setStorage('isShow', 2)
  },
  jumpDetail2: function (e) {
    let id = e.currentTarget.dataset.item.coupon_id;
    wx.navigateTo({
      url: '/pages/detail1/detail1?id=' + id
    })
    common.setStorage('isShow', 3)
  }
})                                     