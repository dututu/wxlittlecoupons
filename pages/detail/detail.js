// pages/detail/detail.js
var app = getApp()
var QRCode = require('../../assets/js/weapp_qrcode.js')
let common = require('../../assets/js/common');
Page({
  data: {
    showShareBtn: true,
    showMask: false,
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
    that.getAdd()
    if (wx.getStorageSync('type')){
      that.setData({
        type: wx.getStorageSync('type'),
        showShareBtn: true
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
    console.log(options)
    // 页面加载的时候获取到unique_id
    if(options.q!=undefined) {
      let src = decodeURIComponent(options.q)
      options = {
        quan_id: src.get_query('quan_id'),
        member_id: src.get_query('member_id'),
        type: src.get_query('type'),
        store_id: src.get_query('storeId')
      }
      console.log(options)
    }
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
        type:options.type,
        storeId: options.store_id
      })
      console.log(options.member_id);
      console.log(this.data.user_id)
      console.log(this.data.user_id);
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
            // 页面初始化 options为页面跳转所带来的参数
            
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
        storeId:options.storeId,
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
  getAdd: function () {
    console.log('海报图片');
    let that = this
    common.post('/poster', {
      type: 3,
    }).then(res => {
      if (res.data.data[0].status == 2) {
        that.setData({
          posterBtn: true,
          poster: res.data.data[0].imgurl,
          showPost: true
        })
      } else {
        that.setData({
          poster: res.data.data[0].imgurl,
          showPost: true
        })
      }
    }).catch(res => {
      console.log('请求失败')
      console.log(res)
    })
  },         
  // 获取优惠券详情
  getDetail() {
    common.get('/coupon/info', {
      lat: this.data.latitude,
      lng: this.data.longitude,
      id: this.data.id,
      storeId: this.data.storeId,
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
    this.hideShare()
    return {
      title: '附近优惠券',
      path: '/pages/detail/detail?quan_id=' + this.data.id + '&&member_id=' + this.data.unique_id+'&&type='+this.data.type+'&&storeId='+this.data.storeId,
    }
  },
  // 推荐人
  person() {
    console.log(this.data.user_id);
    // common.get('/member/referrer', {
    //   type:this.data.type,
    //   id: this.data.unique_id,
    //   recommend_id:this.data.user_id,
    //   coupon_id: this.data.id
    // }).then(res => {
    //   console.log("添加人绑定成功")
    // }).catch(res=>{
    //   let reason = [];
    //   for (let i in res.data.errors) {
    //     reason.push(res.data.errors[i][0])
    //   }
    //   app.showToast(reason[0] || res.data.message, this, 2000)
    // })
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
        coupon_id: _this.data.id,
        store_id: _this.data.storeId
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
  },
  getFormId: function (e) {
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    app.saveFormId(formid, uniqueid)
  },
  //二维码程序
  showShare: function (e) {
    console.log(e)
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    app.saveFormId(formid, uniqueid)
    this.setData({
      showMask: true
    })
  },
  hideShare: function () {
    this.setData({
      showMask: false
    })
  },
  drawCode2: function () {
    let ctx = wx.createCanvasContext('firstCanvas')
    let that = this
    let code = wx.getStorageSync('cbqrcode')
    let head = wx.getStorageSync('avatar')
    console.log('画图了吗')
    // wx.getImageInfo({
    //   src: code,
    //   success: function (res) {
    //     ctx.drawImage(res.path, 830, 1150, 170, 170)
    //     ctx.draw(true, function (e) {
    //       wx.canvasToTempFilePath({
    //         canvasId: 'firstCanvas',
    //         success: function (res) {
    //           that.savePoster2(res.tempFilePath)
    //           that.setData({
    //             posterUrl: res.tempFilePath
    //           })
    //         }
    //       })
    //     })
    //   }
    // })
    let qrcode = new QRCode('qrcode', {
      text: common.couponCode + wx.getStorageSync('unique_id') + '&quan_id=' + that.data.id,
      width: 170,
      height: 170,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    setTimeout(function () { 
      qrcode.exportImage(function (path) {
        ctx.drawImage(path, 850, 1150, 170, 170)
        ctx.draw(true, function (e) {
          wx.canvasToTempFilePath({
            canvasId: 'firstCanvas',
            success: function (res) {
              that.savePoster2(res.tempFilePath)
              that.setData({
                posterUrl: res.tempFilePath
              })
            }
          })
        })
      })

    }, 1000);
    
  },
  convertHead2: function () {
    let that = this
    let ctx = wx.createCanvasContext('headCanvas')
    let head = wx.getStorageSync('avatar')
    if (head) {
      wx.getImageInfo({
        src: head,
        success: function (res) {
          console.log(res)
          ctx.beginPath()
          ctx.arc(50, 50, 50, 0, 2 * Math.PI)
          ctx.clip()
          ctx.drawImage(res.path, 0, 0, 100, 100)
          ctx.draw(true, function (e) {
            wx.canvasToTempFilePath({
              canvasId: 'headCanvas',
              success: function (res) {
                let ctx = wx.createCanvasContext('firstCanvas')
                ctx.drawImage(res.tempFilePath, 80, 1020, 100, 100)
                ctx.draw(true)
                console.log('画二维码')
                that.drawCode2()
              }
            })
          }
          )
        }
      })
    } else {
      that.drawCode2()
    }
  },
  makePoster2: function (e) {
    console.log(e)
    //画图
    let formid = e.detail.formId
    let uniqueid = wx.getStorageSync('unique_id')
    let that = this
    app.saveFormId(formid, uniqueid)
    this.hideShare()
    app.showToast('正在生成海报，请稍候...', this, 3000)
    let ctx = wx.createCanvasContext('firstCanvas')
    let name = wx.getStorageSync('nickname')
    let date = app.getCurrentDate()
    let couponName = that.data.detailInfo.name;
    let fontSize
    if(couponName<=15)
      fontSize=53
    else 
      fontSize=35
    wx.getImageInfo({
      src: that.data.poster,
      success: function (res) {
        console.log(res.path)
        ctx.drawImage(res.path, 0, 0, 1079, 1364)
        ctx.draw(true)
        console.log('画背景')
        ctx.setFontSize(fontSize)
        ctx.setTextAlign('center')
        ctx.fillText(couponName, 540, 560)
        ctx.draw(true)
        ctx.setTextAlign('left')
        ctx.setFontSize(27)
        ctx.fillText('活动时间：', 245, 660)
        ctx.draw(true)
        ctx.setFontSize(29)
        ctx.fillText(that.data.detailInfo.start+'-'+ that.data.detailInfo.end+','+that.data.detailInfo.week+','+ that.data.detailInfo.time+'可用', 245, 700)
        ctx.draw(true)
        ctx.setFontSize(27)
        ctx.fillText('位置：', 245, 750)
        ctx.draw(true)
        ctx.setFontSize(29)
        ctx.fillText(that.data.detailInfo.address, 245, 790)
        ctx.draw(true)
        ctx.setFontSize(30)
        ctx.fillText(date + ' 正在【附近优惠券】平台邀请您分享优惠券', 186, 1115)
        ctx.draw(true)
        if (name) {
          ctx.setFontSize(32)
          ctx.fillText(name, 218, 1070)
          ctx.draw(true)

          //头像
          console.log('画头像')
          that.convertHead2()
        } else {
          that.drawCode2()
        }
      }
    })


    //二维码
  },
  getPoster: function (url) {
    wx.getImageInfo({
      src: url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showModal({
              title: '海报已保存到系统相册',
              content: '快去分享给朋友，叫伙伴们来围观吧',
              confirmText: '我知道了',
              showCancel: false,
              success: function (res) {
              }
            })
          },
          fail(res) {
            app.showToast('海报生成失败，请重试', that, 3000)
            console.log(res)
          }
        })
      }
    })
  },
  //保存海报
  savePoster2: function (url) {
    let that = this
    this.hideShare()
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('授权成功')
          that.getPoster(url)
        } else {
          console.log('授权失败')

          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('再次授权成功')

              that.getPoster(url)
            },
            fail() {
              wx.navigateTo({
                url: '/pages/authorize/authorize',
              })
            }
          })
        }
      }
    })
  },
})