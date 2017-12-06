// pages/detail/detail.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    commentShow: false,
    codeShow: false,
    detailInfo: {},
    commentList: [],
    searchText: '',
    page: 1,
    total: null,
    scrollStyle: {},
    options: {},
    isShowToast:false,
    lingqu:true,
    pinglun:true
  },
  onShow(){
    let that = this
    if (wx.getStorageSync('type')){
      that.setData({
        type: wx.getStorageSync('type')
      })
    }
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] === true && res.authSetting['scope.userLocation'] === true) {
          if (that.data.options.quan_id) {
            that.setData({
              id: that.data.options.quan_id,
              user_id: that.data.options.member_id,
              type: that.data.options.type
            })
            if (wx.getStorageSync('unique_id')) {
              that.setData({
                unique_id: wx.getStorageSync('unique_id')
              })
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                  // 获取优惠券详情
                  that.getDetail();
                  // 获取优惠券评论
                  that.getComment();
                  // 绑定推荐人
                  that.person();
                },
              })
            } else {
              console.log('重新获取id')
              app.getUserInfo(function (e, res) { }, function (e, res) {
                e = e || {}
                e.code = e.code || res.data.code
                let user = res
                common.post('/member/handle', {
                  code: e.code,
                  encryptedData: user.encryptedData,
                  iv: user.iv
                }).then(unique_id => {
                  that.setData({
                    unique_id: unique_id.data.data.data
                  })
                  wx.setStorageSync('unique_id', that.data.unique_id)
                  // 获取优惠券详情
                  that.getDetail();
                  // 获取优惠券评论
                  that.getComment();
                  // 绑定推荐人
                  that.person();
                })
              })
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                },
                // complete() {
                //   wx.getSetting({
                //     success: (res) => {
                //       if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope   .userLocation'] === false) {
                //         wx.navigateTo({
                //           url: '/pages/authorize/authorize',
                //         })
                //       }
                //     }
                //   })
                // }
              })
            }
          } else {
            that.setData({
              id: that.data.options.id,
              unique_id: wx.getStorageSync('unique_id'),
              type:wx.getStorageSync('type')
            })
            // 获取优惠券详情
            that.getDetail();
            // 获取优惠券评论
            that.getComment();
          }
        }
      }
    })
  },
  onLoad: function (options) {
    // 页面加载的时候获取到unique_id
    let that = this
    that.setData({
      options: options,
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude'),
      type:wx.getStorageSync('type')
    })
    console.log(that.data.type)
    if (options.quan_id) {
      that.setData({
        id: options.quan_id,
        user_id: options.member_id,
        type:options.type
      })
      if (wx.getStorageSync('unique_id')) {
        that.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            // 获取优惠券详情
            that.getDetail();
            // 获取优惠券评论
            that.getComment();
            // 绑定推荐人
            that.person();
          },
        })
      } else {
        app.getUserInfo(function (e, res) { }, function (e, res) {
          e = e || {}
          e.code = e.code || res.data.code
          let user = res
          common.post('/member/handle', {
            code: e.code,
            encryptedData: user.encryptedData,
            iv: user.iv
          }).then(unique_id => {
            that.setData({
              unique_id: unique_id.data.data.data
            })
            wx.setStorageSync('unique_id', that.data.unique_id)
            // 获取优惠券详情
            that.getDetail();
            // 获取优惠券评论
            that.getComment();
            // 绑定推荐人
            that.person();
          })
        })
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
          },
          complete() {
            wx.getSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope   .userLocation'] === false) {
                  wx.navigateTo({
                    url: '/pages/authorize/authorize',
                  })
                }
              }
            })
          }
        })
      }
     } else {
      that.setData({
        id: options.id,
        unique_id: wx.getStorageSync('unique_id'),
      })
      // 获取优惠券详情
      that.getDetail();
      // 获取优惠券评论
      that.getComment();
    }
    let res = wx.getSystemInfoSync()
    this.setData({
      scrollStyle: {
        width: res.windowWidth,
        height: res.windowHeight
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
    // 获取优惠券详情
    // this.getDetail();
  },            
  // 获取优惠券详情
  getDetail() {
    common.get('/coupon/info', {
      lat: this.data.latitude,
      lng: this.data.longitude,
      id: this.data.id,
      unique_id: this.data.unique_id
    }).then(res => {
      this.setData({
        detailInfo: res.data.data,
        phone: res.data.data.phone
      })
    }).catch(err => {
      let reason = [];
      for (let i in err.data.errors) {
        reason.push(err.data.errors[i][0])
      }
      app.showToast(reason[0] || err.data.message, this, 2000)
    })
  },
  onShareAppMessage: function () {
    let _this = this
    return {
      title: '附近优惠券',
      path: '/pages/detail/detail?quan_id=' + this.data.id + '&&member_id=' + this.data.unique_id+'&&type='+this.data.type,
    }
  },
  // 推荐人
  person() {
    common.get('/member/referrer', {
      type:this.data.type,
      id: this.data.unique_id,
      recommend_id:this.data.user_id,
      coupon_id: this.data.id
    }).then(res => {
      console.log("添加人绑定成功")
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
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
  // 点击电话图片打电话
  tel: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    })
  },
  // 获取评论的函数
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
  // 失去焦点的时候获取到输入的内容
  inputInfo: function (e) {
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
        _this.getComment(_this.data.page);
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
            list[index].showColor = true,
            this.setData({
              commentList: list,
            })
          // 点赞之后重新获取评论
          this.getComment(this.data.data);
        })
      })
    } else if (list[index].islike == 1) {
      return false
    }
  },
  bindscrolltoupper: function () {
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    that.getComment();
  },
  // 点击支付领取优惠券  
  pay: function () {
    let _this = this;
    if(_this.data.lingqu){
      _this.data.lingqu=false
      common.post('/order/createOrder', {
        unique_id: _this.data.unique_id,
        coupon_id: _this.data.id
      }).then(res => {
        setTimeout(function(){
          _this.setData({
            lingqu:true
          })
        },1000)
        if (res.data.err_msg) {
          app.showToast(res.data.err_msg, _this, 2000)
        } else {
          if (res.data.result) {
            wx.showModal({
              title: '领取成功',
              content: '请到我的优惠券查看',
              success: function (res) {
                console.log(res)
                if (res.confirm == true) {
                  wx.navigateTo({
                    url: '/pages/mineCoupon/mineCoupon'
                  })
                }
              }
            })
          } else {
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success': function (res) {
                wx.showModal({
                  title: '领取成功',
                  content: '请到我的优惠券查看',
                  success: function (res) {
                    if (res.confirm == true) {
                      wx.navigateTo({
                        url: '/pages/mineCoupon/mineCoupon'
                      })
                    }
                  }
                })
              },
              'fail': function (res) {
                if (res.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '取消支付',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: '支付失败',
                    duration: 2000
                  })
                }
              },
            })
          }
        }
      }).catch(res => {
        setTimeout(function () {
          _this.setData({
            lingqu: true
          })
        }, 1000)
        let reason = [];
        for (let i in res.data.errors) {
          reason.push(res.data.errors[i][0])
        }
        app.showToast(reason[0] || res.data.message, this, 2000)
      })
    }
  }
})