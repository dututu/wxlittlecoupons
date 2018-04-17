// pages/detail/detail.js
let common = require('../../assets/js/common');
var app = getApp()
Page({
  data: {
    commentShow: false,
    codeShow: false,
    detailInfo: {},
    commentList: [],
    page: 1,
    total: null,
    scrollStyle: {},
    isShowToast:false,
    pinglun:true
  },
  onLoad: function (options) {
    
    
    this.setData({
      id: options.id,
      order_id:options.order_id,
      store_id: options.store_id,
      bgc: options.id % 3
    })
    // 页面初始化 options为页面跳转所带来的参数
    let res = wx.getSystemInfoSync()
    this.setData({
      scrollStyle: {
        width: res.windowWidth,
        height: res.windowHeight
      }
    })
    // 页面加载的时候获取到unique_id
    this.setData({
      unique_id: wx.getStorageSync('unique_id'),
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude')
    })
    common.get('/coupon/info', {
      lat: this.data.latitude,
      lng: this.data.longitude,
      id: this.data.id,
      storeId : this.data.store_id,
      unique_id: this.data.unique_id,
      order_id: this.data.order_id
    }).then(res => {
      this.setData({
        detailInfo: res.data.data,
        phone: res.data.data.phone
      })
    })
    this.getComment();
  },
  // 页面加载的时候获取到优惠券的评论
  getComment: function () {
    common.get('/coupon/comments', {
      id: this.data.id,
      unique_id: this.data.unique_id,
    }).then(res => {
      let list = res.data.data;
      for (let i = 0; i < list.length; i++) {
        if (list[i].islike == 0) {
          list[i].imgSrc = '../../imgs/dianzan.png',
            list[i].showColor = false
        } else if (list[i].islike == 1) {
          list[i].imgSrc = '../../imgs/dianzan1.png',
            list[i].showColor = true
        }
      }
      this.setData({
        page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
        total: res.data.meta.pagination.total_pages,
        commentList: list
      })
    })
  },
  // 页面滑动到底部加载更多
  bindscrolltoupper: function () {
    if (this.data.page <= this.data.total) {
      this.getComment(this.data.page);
    }
  },
  // 点击立即使用弹出二维码盒子
  popCode: function () {
    let _this=this
    common.get('/order/code', {
      unique_id: this.data.unique_id,
      order_id:this.data.order_id
    }).then(res => {
      this.setData({
        imgSrc: res.data.data,
        codeShow:true
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.message, _this, 2000)
    })
  },
  // 点击二维码的盒子进行关闭
  closePop: function () {
    this.setData({
      codeShow: false
    })
  },
  // 点击电话图片打电话
  tel: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    })
  },
  // 点击导航图标进行导航
  nav: function () {
    let _this = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        wx.openLocation({
          latitude: _this.data.detailInfo.lat,
          longitude: _this.data.detailInfo.lng,
          address: _this.data.detailInfo.address
        })
      }
    })
  },
  // 点击写评论的时候弹出评论盒子
  popComment: function () {
    this.setData({
      commentShow: true
    })
  },
  // 点击评论盒子关闭盒子
  popClose: function () {
    this.setData({
      commentShow: false
    })
  },
  inputInfo(e){
    this.setData({
      searchText: e.detail.value
    })
  },
  // 点击提交的时候提交评论
  submit: function () {
    let _this=this
    if(_this.data.pinglun){
      _this.data.pinglun=false
      common.post('/coupon/commenting', {
        id: _this.data.id,
        unique_id: _this.data.unique_id,
        comments: _this.data.searchText
      }).then(e => {
      setTimeout(function(){
        _this.setData({
          pinglun:true
        })
      },1000)
      _this.setData({
        commentShow: false
      })
      _this.getComment();
      }).catch(res => {
        setTimeout(function () {
          _this.setData({
            pinglun: true
          })
        }, 1000)
        let reason = [];
        for (let i in res.data.errors) {
          reason.push(res.data.errors[i][0])
        }
        app.showToast(reason[0] || res.data.message, _this, 2000)
      })
    }
  },
  // 对评论进行点赞功能
  good: function (e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.commentList;
    this.setData({
      commentId: list[index].id
    })
    if (list[index].islike == 0) {
      list[index].islike = 1;
      common.post('/coupon/commentslike', {
        comment_id: this.data.commentId,
        unique_id: this.data.unique_id
      }).then(e => {
        common.get('/coupon/comments', {
          id: this.data.id,
          unique_id: this.data.unique_id
        }).then(res => {
          list[index].imgSrc = '../../imgs/dianzan1.png',
            list[index].showColor = true
          this.setData({
            commentList: list,
          })
          common.get('/coupon/comments', {
            id: this.data.id,
            unique_id: this.data.unique_id
          }).then(res => {
            let list = res.data.data;
            for (let i = 0; i < list.length; i++) {
              if (list[i].islike == 0) {
                list[i].imgSrc = '../../imgs/dianzan.png',
                  list[i].showColor = false
              } else if (list[i].islike == 1) {
                list[i].imgSrc = '../../imgs/dianzan1.png',
                  list[i].showColor = true
              }
            }
            this.setData({
              commentList: list
            })
          })
        })
      })
    } else if (list[index].islike == 1) {
      return false
    }
  },
})