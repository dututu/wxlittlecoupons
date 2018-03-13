// pages/mineCoupon/mineCoupon.js
var app = getApp()
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
    unShow: false,
    isScroll: true,
    codeShow: false,
    startX: 0,
    startY: 0,
    isShowToast:false
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
    // 页面加载的时候获取到unique_id
    this.setData({
      unique_id: wx.getStorageSync('unique_id')
    })
    // 页面加载的时候获取数据
    this.getData(1);
    // 页面加载的时候获取到三种状态的个数
    this.getNum();
    this.getList();
    // 自动刷新退券状态
    if (wx.getStorageSync('unique_id')){
      setInterval(function(){
        common.get('/coupon/mycoupon_allnum', {
          unique_id: that.data.unique_id,
          loading:false
        }).then(res => {
          that.setData({
            num: res.data
          })
          if (res.data.overtime == 0 && res.data.unused == 0 && res.data.used == 0) {
            that.setData({
              unShow: true
            })
          }
        })
        common.get('/coupon/mycoupon',{
          unique_id: that.data.unique_id,
          status: parseFloat(that.data.currentTab)+1,
          loading:false
        }).then(res=>{
          that.data.info[parseInt(that.data.currentTab)] = res.data.data;
          that.setData({
            info: that.data.info,
            infoList: that.data.info[parseInt(that.data.currentTab)]
          })
        })
      },3000)
    }
  },
  getList: function () {
    common.get('/coupon/mycoupon', {
      unique_id: this.data.unique_id,
      status: 2,
      page: 1
    }).then(res => {
      // console.log(res.data.data)
    })
  },
  // 点击优惠券右边的立即使用按钮，弹出二维码
  use: function (e) {
    let id = e.currentTarget.dataset.item.id
    common.get('/order/code', {
      unique_id: this.data.unique_id,
      order_id: id
    }).then(res => {
      this.setData({
        imgSrc: res.data.data,
        codeShow: true
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 点击关闭按钮的时候关闭弹出层
  closePop: function () {
    this.setData({
      codeShow: false
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.infoList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      infoList: this.data.infoList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.infoList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      infoList: that.data.infoList
    })
  },
  /**
* 计算滑动角度
* @param {Object} start 起点坐标
* @param {Object} end 终点坐标
*/
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
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
    this.getData(1);
  },
  // 请求页面信息
  reqInfo(status, page = 1, cb) {
    common.get('/coupon/mycoupon', {
      unique_id: this.data.unique_id,
      status: status,
      page: page
    }).then(res => {
      cb.call(this, res)
    })
  },
  // 页面加载的时候，获取的数据
  getData: function (type, cb) {
    if (type == 1 && (!this.data.info[parseInt(this.data.currentTab)] || this.data.info[parseInt(this.data.currentTab)].length == 0)) {
      this.reqInfo(parseInt(this.data.currentTab) + 1, this.data.pageList[this.data.currentTab].page, res => {
        cb && cb(res)
        this.data.pageList[parseInt(this.data.currentTab)] = {
          page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
          total: res.data.meta.pagination.total_pages
        }
        this.data.info[parseInt(this.data.currentTab)] = res.data.data;
        this.setData({
          pageList: this.data.pageList,
          info: this.data.info,
          infoList: this.data.info[parseInt(this.data.currentTab)]
        })
        console.log(this.data.infoList)
      })
    } else if (type == 2) {
      this.reqInfo(parseInt(this.data.currentTab) + 1, this.data.pageList[this.data.currentTab].page, res => {
        this.data.pageList[parseInt(this.data.currentTab)] = {
          page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
          total: res.data.meta.pagination.total_pages
        }
        this.data.info[parseInt(this.data.currentTab)] = [...this.data.info[parseInt(this.data.currentTab)], ...res.data.data];
        this.setData({
          pageList: this.data.pageList,
          info: this.data.info,
          infoList: this.data.info[parseInt(this.data.currentTab)]
        })
      })
    } else {
      this.setData({
        infoList: this.data.info[parseInt(this.data.currentTab)]
      })
    }
  },
  // 页面下拉的时候执行这个函数
  bindscrolltoupper: function () {
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
  // 获取我的优惠券三种状态的个数
  getNum: function () {
    let _this = this
    common.get('/coupon/mycoupon_allnum', {
      unique_id: this.data.unique_id
    }).then(res => {
      this.setData({
        num: res.data
      })
      if (res.data.overtime == 0 && res.data.unused == 0 && res.data.used == 0) {
        this.setData({
          unShow: true
        })
      }
    })
  },
  // 跳转到详情页的函数
  jumpDetail: function (e) {
    let id = e.currentTarget.dataset.item.coupon_id;
    let order_id = e.currentTarget.dataset.item.id
    let store_id = e.currentTarget.dataset.item.storeId ? e.currentTarget.dataset.item.storeId : 0
    wx.navigateTo({
      url: '/pages/detail1/detail1?id=' + id + '&order_id=' + order_id + '&store_id=' + store_id
    })
  },
  // 点击删除按钮删除此条优惠券
  delete: function (e) {
    let _this=this
    let id = e.currentTarget.dataset.item.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗?',
      success: function (res) {
        if (res.confirm) {
          common.get('/coupon/myCouponDestory', {
            order_id: id
          }).then(res => {
            _this.getNum();
            common.get('/coupon/mycoupon',{
              unique_id: _this.data.unique_id,
              status: parseInt(_this.data.currentTab)+1,
            }).then(res=>{
              _this.setData({
                info: res.data.data,
                infoList: _this.data.info[parseInt(_this.data.currentTab)]
              })
            })
            // _this.reqInfo(parseInt(this.data.currentTab) + 1, 1, res => {
            //   _this.data.info[parseInt(this.data.currentTab)] = res.data.data;
            //   _this.setData({
            //     info: _this.data.info,
            //     infoList: _this.data.info[parseInt(_this.data.currentTab)]
            //   })
            // })
          }).catch(res => {
            let reason = [];
            for (let i in res.data.errors) {
              reason.push(res.data.errors[i][0])
            }
            app.showToast(reason[0] || res.data.message, this, 2000)
          })
        }
      }
    })
  },
  // 退券函数
  retreat(e){
    let _this=this
    let order_id=e.currentTarget.dataset.item.id
    if (e.currentTarget.dataset.item.status == 2 || e.currentTarget.dataset.item.status == 2){
      wx.showModal({
        title: '提示',
        content: '确认退券吗?',
        success: function (res) {
          if (res.confirm) {
            common.get('/coupon/retreat', {
              order_id: order_id,
              unique_id: _this.data.unique_id
            }).then(res => {
              app.showToast(res.data.data.data, _this, 2000)
              _this.getNum();
              common.get('/coupon/mycoupon', {
                unique_id: _this.data.unique_id,
                status: 1,
              }).then(res => {
                _this.setData({
                  infoList: res.data.data
                })
              })
            }).catch(res => {
              let reason = [];
              for (let i in res.data.errors) {
                reason.push(res.data.errors[i][0])
              }
              app.showToast(reason[0] || res.data.message, this, 2000)
            })
          }
        }
      })
    }
  },
  // 置顶函数
  stick: function (e) {
    let index=e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.item.id
    common.get('/coupon/myCouponTop', {
      order_id: id
    }).then(res => {
      this.data.info[parseInt(this.data.currentTab)] = res.data.data;
      this.setData({
        info: this.data.info,
        infoList: this.data.info[parseInt(this.data.currentTab)]
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
})                                     