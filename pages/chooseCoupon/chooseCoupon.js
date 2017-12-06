// pages/chooseCoupon/chooseCoupon.js
let common = require('../../assets/js/common');
Page({
    data: {
        drawList: [],
        currentTab: 0,
        chooseList: [],
        chooseShow: false,
        info: [],
        pageList: [{
            p: 1,
            t: null
        }, {
            p: 1,
            t: null
        }, {
            p: 1,
            t: null
        },],
        isScroll:true
    },
    onLoad: function (options) {
        this.setData({
            chooseId:options.id
        })
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        let res = wx.getSystemInfoSync()
        that.setData({
            scrollStyle: {
                width: res.windowWidth,
                height: res.windowHeight
            }
        })
        // 页面加载的时候获取缓存中的unique_id
        common.getStorage('unique_id').then(res => {
            this.setData({
              unique_id: res.data
            })
        })
        // 页面加载的时候调取获取数据统计的函数
        this.getNum();
        // 页面加载的时候调取数据
        this.getList(1)
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
                drawList: this.data.info[this.data.currentTab]
            })
            return false;
        }
        this.getList(1);
    },
    // 获取数据
    getRecord(page, cb) {
        let _this=this
        common.post('/record', {
            id: _this.data.chooseId,
            type: parseInt(_this.data.currentTab) + 1,
            page: page
        }).then(res => {
          setTimeout(function () {
            _this.setData({
              iScroll: true
            })
          }, 1000)
            cb.call(this, res)
        }).catch(res=>{
          setTimeout(function () {
            _this.setData({
              iScroll: true
            })
          }, 1000)
        })
    },
    // 点击每一项之后，出现数据
    getList: function (type) {
        let _this=this
         if (type == 1 && (!this.data.info[this.data.currentTab] || this.data.info[this.data.currentTab].length == 0)) {
            this.getRecord(this.data.pageList[this.data.currentTab].p, res => {
                this.data.pageList[this.data.currentTab] = {
                    p: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
                    t: res.data.meta.pagination.total_pages
                }
                this.data.info[this.data.currentTab] = res.data.data;
                this.setData({
                    pageList: this.data.pageList,
                    info: this.data.info,
                    drawList: this.data.info[this.data.currentTab]
                })
            })
        } else if (type == 2) {
            this.getRecord(this.data.pageList[this.data.currentTab].p, res => {
                this.data.pageList[this.data.currentTab] = {
                    p: res.data.data.length > 0 ? res.data.meta.pagination.current_page + 1 : res.data.meta.pagination.current_page,
                    t: res.data.meta.pagination.total_pages
                }
                this.data.info[this.data.currentTab] = [...this.data.info[this.data.currentTab], ...res.data.data];
                this.setData({
                    pageList: this.data.pageList,
                    info: this.data.info,
                    drawList: this.data.info[this.data.currentTab]
                })
            })
        } else {
            this.setData({
              drawList: this.data.info[this.data.currentTab]
            })
        }
    },
    getNum: function () {
        common.post('/mycouponnum', {
            id: this.data.chooseId
        }).then(res => {
            this.setData({
                num: res.data.num
            })
            if (res.data.num.browse_num == 0 &&res.data.num.browse_num == 0 &&res.data.num.browse_num == 0) {
                this.setData({
                    unShow: true
                })
            }
        })
    },
    bindscrolltoupper() {
      let _this=this
      if(this.data.iScroll){
        _this.data.iScroll=false
        _this.getList(2)
      }
    }
})