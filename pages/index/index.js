//index.js
//获取应用实例
var app = getApp()
let common = require('../../assets/js/common.js');
var QRCode = require('../../assets/js/weapp_qrcode.js')

Page({
  data: {
    posterBtn:false,
    showPost:false,
    showShareBtn:false,
    showMask:false,
    options: {},
    imgUrls: [],
    indicatorDots: true,
    interval: 5000,
    autoplay:true,
    circular:true,
    duration: 300,
    isScroll: true,
    refresh: true,
    isShowToast: false,
    index: 0,
    navList: [{
      imgSrc: '../../imgs/nav11.png',
      text: '推荐',
      color: 'color',
      index: 0,
      _imgSrc: '../../imgs/nav1.png'
    }, {
      imgSrc: '../../imgs/nav2.png',
      text: '美食',
      color: 'color',
      index: 2,
      _imgSrc: '../../imgs/nav22.png'
    }, {
      imgSrc: '../../imgs/nav3.png',
      text: '娱乐',
      color: 'color',
      index: 3,
      _imgSrc: '../../imgs/nav33.png'
    }, {
      imgSrc: '../../imgs/nav4.png',
      text: '电影',
      color: 'color',
      index: 1,
      _imgSrc: '../../imgs/nav33.png'
    }, {
      imgSrc: '../../imgs/nav5.png',
      text: '酒店',
      color: 'color',
      index: 4,
      _imgSrc: '../../imgs/nav44.png'
    }, {
      imgSrc: '../../imgs/nav6.png',
      text: '购物',
      color: 'color',
      index: 10,
      _imgSrc: '../../imgs/nav55.png'
    }, {
      imgSrc: '../../imgs/nav7.png',
      text: '丽人',
      color: 'color',
      index: 7,
      _imgSrc: '../../imgs/nav66.png'
    }, {
      imgSrc: '../../imgs/nav8.png',
      text: '亲子',
      color: 'color',
      index: 11,
      _imgSrc: '../../imgs/nav77.png'
    }, {
      imgSrc: '../../imgs/nav9.png',
      text: '教育',
      color: 'color',
      index: 6,
      _imgSrc: '../../imgs/nav88.png'
    }, {
      imgSrc: '../../imgs/nav10.png',
      text: '其他',
      color: 'color',
      index: 8,
      _imgSrc: '../../imgs/nav1010.png'
    }],
    infoList: [],
    pageList: [{
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
      page: 1,
      total: null
    }, {
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
    scrollStyle: {}
  },
  onShow() {
    console.log('onShow先执行')
    
    let _this = this
    let unique_id = wx.getStorageSync('unique_id') || false;
    this.setData({
      unique_id: unique_id,
      showShareBtn:true
    })
    if (wx.canIUse('openBluetoothAdapter')) {
      if (unique_id) {
        wx.showShareMenu({});
      } else {
        wx.hideShareMenu({
        })
      }
    }
    
    _this.getLocation(function () {
      _this.getData(1)
    });
  },
  // else{
  //   _this.setData({
  //     type: 1
  //   })
  //         if (wx.getStorageSync('unique_id')) {
  //     _this.setData({
  //       unique_id: wx.getStorageSync('unique_id')
  //     })
  //   } else {
  //     _this.getOpenid();
  //   }
  //         _this.getLocation(function () {
  //     _this.getData(1)
  //   });
  // }
  // getAdd:function() {
  //   console.log('海报图片');
  //   let that = this
  //   common.post('/poster', {
  //     type: 2,
  //   }).then(res => {
  //     if (res.data.data[0].status==2) {
  //       that.setData({
  //         posterBtn: true, 
  //         poster: res.data.data[0].imgurl,
  //         showPost: true
  //       })
  //     } else {
  //       that.setData({
  //         poster: res.data.data[0].imgurl,
  //         showPost: true
  //       })
  //     }
  //   }).catch(res=>{
  //     console.log('请求失败')
  //     console.log(res)
  //   })
  // },
  //事件处理函数
  onLoad: function (options) { 
    var self = this
    self.setData({
      options: options
    })
    
    // self.getAdd()
    if (options.user_id) {
      self.setData({
        user_id: options.user_id,
        type:1
      })
      if (wx.getStorageSync('unique_id')) {
        self.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
        wx.setStorageSync('unique_id', self.data.unique_id)
        //self.bindPerson();
      } else {
        
      }
    }else {
      self.setData({
        type:1
      })
      if (wx.getStorageSync('unique_id')) {
        self.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
      } else {
        self.getOpenid();
      }
    }
     if (wx.getStorageSync('unique_id')) {
        self.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
      }
    let res = wx.getSystemInfoSync()
    self.setData({
      scrollStyle: {
        width: res.windowWidth,
        height: res.windowHeight
      }
    })
    // 页面加载的时候调取搜索接口
    // 页面记载的时候让第一个导航出现阴影
    let list = this.data.navList
    list[app.data.currentClickNavIndex]._imgSrc = '../../imgs/nav' + (app.data.currentClickNavIndex + 1) + '.png';
    list[app.data.currentClickNavIndex].imgSrc = '../../imgs/nav' + (app.data.currentClickNavIndex + 1) + '' + (app.data.currentClickNavIndex + 1) + '.png';
    list[app.data.currentClickNavIndex].color = 'color0'
    this.setData({
      navList: list,
      currentTab: app.data.currentClickNavIndex
    })
    // 页面加载的时候进行定位
    this.getLocation(function () {
      this.getData(1)
    });
    // 页面加载的时候获取到轮播图的列表
    this.getBanner();
  },
  onHide() {
    wx.setStorageSync('type', this.data.type)
  },
  // 页面分享功能
  onShareAppMessage: function (e) {
    console.log(e)
    if(e.target==undefined) {
      return {
        title: '附近优惠券',
        path: '/pages/poster/poster?member_id=' + wx.getStorageSync('unique_id') + '&type=1',
        imageUrl: '../../imgs/couponPic.jpg'
      }
    } else  {
      return {
        title: e.target.dataset.name,
        path: '/pages/detail/detail?quan_id=' + e.target.dataset.id + '&&member_id=' + wx.getStorageSync('unique_id') + '&&type=1&&storeId=' + e.target.dataset.storeId,
        imageUrl: '../../imgs/couponPic.jpg'
      }
      
    }
    
  },
  bindPerson() {
    // common.get('/member/referrer', {
    //   type: this.data.type,
    //   id: this.data.unique_id,
    //   recommend_id: this.data.user_id
    // }).then(res => {
    //   console.log('绑定成功')
    //   console.log(this.data.type)
    //   console.log('line177' + this.data.unique_id)
    //   console.log('line178' + this.data.user_id)
    // }).catch(res => {
    //   let reason = [];
    //   for (let i in res.data.errors) {
    //     reason.push(res.data.errors[i][0])
    //   }
    //   app.showToast(reason[0] || res.data.message, this, 2000)
    // })
  },
  // 点击每一张banner图片的时候跳转到优惠券详情页
  jumpPage: function (e) {
    let id = e.currentTarget.dataset.item.coupon_id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  // 页面加载的时候获取到openid
  getOpenid: function (callback) {
    var self = this;
    app.getUserInfo(function (e, res) { }, function (e, res) {
      common.post('/member/handle', {
        code: res.data.code,
        encryptedData: res.encryptedData,
        iv: res.iv
      }).then(unique_id => {
        self.setData({
          unique_id: unique_id.data.data.data
        })
        wx.setStorageSync('unique_id', self.data.unique_id)
        wx.setStorageSync('session_key', unique_id.data.data.session_key)
      })
    })
  },
  // 页面一加载就进行定位
  getLocation: function (callback) {
    let _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        common.setStorage('latitude', res.latitude)
        common.setStorage('longitude', res.longitude)
        callback.call(_this)
      },
      // complete: function () {
      //   wx.getSetting({
      //     success: (res) => {
      //       if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope.userLocation'] === false) {
      //         wx.navigateTo({
      //           url: '/pages/authorize/authorize',
      //         })
      //       }
      //     }
      //   })
      // }
    })
  },
  // 页面加载的时候获取到轮播图列表
  getBanner: function () {
    common.get('/banner', {}).then(res => {
      this.setData({
        interval: res.data.data[0].carousel_time,
        imgUrls: res.data.data
      })
    })
  },
  //请求页面信息
  reqInfo(type, page = 1, cb) {
    common.get('/coupon/lists', {
      lng: this.data.longitude,
      lat: this.data.latitude,
      type: type,
      page: page
    }).then(res => {
      cb.call(this, res)
    }, res => {
      console.log(res)
    })
  },
  // 页面加载的时候获取到附近优惠券
  getData: function (type, cb) {
    let that = this
    
    if (type == 1 && (!this.data.info[this.data.index] || this.data.info[this.data.index].length == 0)) {
      this.reqInfo(this.data.index, this.data.pageList[this.data.index].page, res => {
        cb && cb(res)
        this.data.pageList[this.data.index] = {
          page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
          total: res.data.meta.pagination.total_pages
        }
        this.data.info[this.data.index] = res.data.data;
        this.setData({
          pageList: this.data.pageList,
          info: this.data.info,
          infoList: this.data.info[this.data.index]
        })
      })
    } else if (type == 2) {
      this.reqInfo(this.data.index == 0 ? this.data.index : this.data.index + 1, this.data.pageList[this.data.index].page, res => {
        console.log(res.data.data)
        cb && cb(res)
        this.data.pageList[this.data.index] = {
          page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
          total: res.data.meta.pagination.total_pages
        }
        this.data.info[this.data.index] = [...this.data.info[this.data.index], ...res.data.data];
        this.setData({
          pageList: this.data.pageList,
          info: this.data.info,
          infoList: this.data.info[this.data.index]
        })
      })
    } else {
      this.setData({
        infoList: this.data.info[this.data.index]
      })
    }

  },
  // // 页面下拉的时候执行这个函数
  bindscrolltolower: function () {
    let _this = this
    if (this.data.isScroll) {
      this.data.isScroll = false;
      this.getData(2, res => {
        if (res) {
          this.setData({
            isScroll: true
          })
        }
      })
    }
  },
  // 点击导航的每一项切换导航的图片
  changeImg: function (e) {
    console.log(e);
    var that = this;
    for (let i = 0; i < this.data.navList.length; i++) {
      this.data.navList[i].imgSrc = '../../imgs/nav' + (i + 1) + '.png';
      this.data.navList[i]._imgSrc = '../../imgs/nav' + (i + 1) + '' + (i + 1) + '.png';
      this.data.navList[i].color = 'color';
    }
    this.data.navList[e.currentTarget.dataset.index].imgSrc = this.data.navList[e.currentTarget.dataset.index]._imgSrc;
    if (e.currentTarget.dataset.index == 0) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color0'
    } else if (e.currentTarget.dataset.index == 1) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color1'
    } else if (e.currentTarget.dataset.index == 2) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color2'
    } else if (e.currentTarget.dataset.index == 3) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color3'
    } else if (e.currentTarget.dataset.index == 4) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color4'
    } else if (e.currentTarget.dataset.index == 5) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color5'
    } else if (e.currentTarget.dataset.index == 6) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color6'
    } else if (e.currentTarget.dataset.index == 7) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color7'
    } else if (e.currentTarget.dataset.index == 8) {
      this.data.navList[e.currentTarget.dataset.index].color = 'color8'
    } else {
      this.data.navList[e.currentTarget.dataset.index].color = 'color9'
    }
    this.setData({
      index: e.currentTarget.dataset.tindex,
      navList: this.data.navList,
    })
    if (this.data.currentTab === e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.index
      })
    }
    common.setStorage('index', e.currentTarget.dataset.index)
    app.data.currentClickNavIndex = e.currentTarget.dataset.index;
    that.clearData();
    that.getData(1);
  },
  // 点击每一张优惠券获取到详细信息
  jumpDetail: function (e) {
    console.log(e)
    let _this = this
    let id = e.currentTarget.dataset.item.id;
    let storeId = e.currentTarget.dataset.item.storeId;
    this.clearData()
    common.post('/coupon/browse', {
      unique_id: wx.getStorageSync('unique_id'),
      coupon_id: id
    })
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id + '&storeId=' + storeId + '&colorId=' + e.currentTarget.dataset.index
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
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
        page: 1,
        total: null
      }, {
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
  hideShare:function() {
    this.setData({
      showMask: false
    })
  },
  getFormId:function(e) {
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    app.saveFormId(formid, uniqueid)
  },
  // 点击搜索的时候跳转到搜索页面
  jumpSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
})