// pages/publish/publish.js
let common = require('../../assets/js/common');
Page({
    data: {
        publishShow: true,
        publishList: [],
        page: 1,
        add: '',
        info: [],
        total: null,
        scrollStyle: {},
        button: false,
        startX: 0,
        startY: 0
    },
    onLoad: function (options) {
        this.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
        // 获取我发布的优惠券列表
        this.getPublish(this.data.page);
        // 页面加载的时候获取到unique_id
        let res = wx.getSystemInfoSync()
        this.setData({
            scrollStyle: {
                width: res.windowWidth,
                height: res.windowHeight
            }
        })
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.publishList.forEach(function (v, i) {
            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            publishList: this.data.publishList
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
        that.data.publishList.forEach(function (v, i) {
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
            publishList: that.data.publishList
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
    // 页面滑动到底部加载更多
    bindscrolltoupper: function () {
        if (this.data.page <= this.data.total) {
            this.getPublish(this.data.page);
        }
    },
    // 点击每一个优惠券的时候跳转到数据统计页面
    jumpData: function (e) {
        let id = e.currentTarget.dataset.item.id
        wx.navigateTo({
            url: '/pages/chooseCoupon/chooseCoupon?id=' + id
        })
    },
    jumpDetail: function (e) {
      console.log(e);
      let id = e.currentTarget.dataset.item.id
      let storeId = e.currentTarget.dataset.item.storeId
      if (e.currentTarget.dataset.item.status==1) {
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + id + '&storeId=' + storeId
        })
      }
      
    },
    // 点击删除优惠券
    delete: function (e) {
        let _this=this
        let id = e.currentTarget.dataset.item.id;
        wx.showModal({
          title: '提示',
          content: '确认删除吗？',
          success: function (res) {
            if (res.confirm) {
              common.get('/coupon/CouponDestory', {
                id: id
              }).then(res => {
                if (res.data == 'success') {
                  common.get('/coupon/alycoupons', {
                    unique_id: _this.data.unique_id,
                  }).then(res => {
                    _this.data.info = res.data.data
                    _this.setData({
                      page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
                      total: res.data.meta.pagination.total_pages,
                      publishList: _this.data.info
                    })
                  })
                } else {
                  wx.showToast({
                    title: res.data,
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
          }
        })
    },
    // 点击已发布优惠券进行上架上架的切换
    switch: function (e) {
        let that = this
        let index = e.currentTarget.dataset.index;
        let list = this.data.publishList;
        if (list[index].status == 0 || list[index].status == 1) {
            common.get('/coupon/upOrdown', {
              unique_id: this.data.unique_id,
                id: list[index].id
            }).then(res => {
                list[index].status = res.data.status;
                that.setData({
                    publishList: list
                })
            })
        } else {
            return false
        }
    },
    // 点击获取位置的时候获取到经纬度
    getLon: function () {
        let _this = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                if (_this.data.add == '') {
                    wx.chooseLocation({
                        success: function (res) {
                            _this.setData({
                                latitude: res.latitude,
                                longitude: res.longitude,
                                add: res.name
                            })
                        }
                    })
                } else {
                    return false
                }
            }
        })
    },
    getPublish: function (page) {
        let _this = this
        common.get('/coupon/alycoupons', {
          unique_id: this.data.unique_id,
          page: page
        }).then(res => {
            if (res.data.data.length == 0) {
              this.setData({
                noPub:true
              })
              common.get('/member/info', {
                id: _this.data.unique_id
                }).then(res => {
                  wx.setStorageSync('user', res.data.data)
                })
            }else {
              this.setData({
                noPub:false
              })
            }
            this.data.info = [...this.data.info, ...res.data.data]
            this.setData({
                page: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
                total: res.data.meta.pagination.total_pages,
                publishList: this.data.info
            })
        })
    },
    // 点击发布优惠券跳转到发布页面
    jumpNew: function () {
        wx.navigateTo({
            url: '/pages/publish/publish'
        })
    }
})