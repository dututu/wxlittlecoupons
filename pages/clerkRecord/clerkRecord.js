// pages/search/search.js
// pages/clerkPage/clerkPage.js
var app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    info: {},
    couponlist:[],
    users:[],
    couponName:'所有优惠券',
    userName:'所有核销员',
    isShowToast: false,
    page: 0,
    has:false,
    total:'--',
    faceprice:'--',
    price:'--',
    startime:'',
    endtime:'',
    man:'',
    coupon:'',
    manid:'',
    couponid:''
  },
  onLoad: function (e) {
    let _this = this
    if (wx.getStorageSync('unique_id')) {
      _this.setData({
        unique_id: wx.getStorageSync('unique_id')
      })
    }
    this.getCurrentDate();
    this.getCouponInfo();
    this.getCouponTotal();
    this.getCouponIds();
    this.getClerkMan();
    
  },
  getCurrentDate: function() {
    
    let date = this.getNowFormatDate();
    this.setData({
      startTime:date,
      endTime:date
    })
  },
  getNowFormatDate:function() {
    let date = new Date();
    let seperator1 = "-";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate;
  },
  getCouponTotal: function() {
    common.get('/coupon/couponusesum', {
      unique_id: this.data.unique_id,
      user_id:this.data.manid,
      coupon_id:this.data.couponid,
      start_time: this.data.startTime,
      end_time:this.data.endTime
    }).then(res => {
      this.setData({
        faceprice: res.data.coupon_money,
        price: res.data.coupon_price,
      })
    })
  },
  getCouponInfo: function () {
    common.get('/coupon/couponuse', {
      unique_id: this.data.unique_id,
      user_id: this.data.manid,
      coupon_id: this.data.couponid,
      start_time: this.data.startTime,
      end_time: this.data.endTime,
      page: this.data.page
    }).then(res => {
      this.setData({
        info: res.data.data,
        has:true,
        total: res.data.meta.pagination.total
      })
    }).catch(res => {
      this.setData({
        has: false,
        total: '--'
      })
    })
  },
  getCouponIds: function () {
    common.get('/coupon/couponids', {
      unique_id: this.data.unique_id,
    }).then(res => {
      this.setData({
        couponlist:res.data.couponIds
      })
      
    })
  },
  getClerkMan: function () {
    common.get('/coupon/users', {
      unique_id: this.data.unique_id,
    }).then(res => {
      this.setData({
        users: res.data.users,
        manShow:true
      })
    }).catch(res=>{
      this.setData({
        manShow:false
      })
    })
  },
  bindCardName: function (e) {
    let coupon = this.data.couponlist[e.detail.value]
    this.setData({
      coupon:coupon.name,
      couponid:coupon.id
    })
  },
  bindUsers: function (e) {
    let user = this.data.users[e.detail.value]
    this.setData({
      man: user.nickname,
      manid: user.id
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
  },
  powerDrawer:function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停  
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停  
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭抽屉  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  cSearch: function() {
    this.setData(
      {
        showModalStatus: false,
        startime:'',
        endtime:'',
        man: '',
        manid: '',
        coupon: '',
        couponid: ''
      }
    );
  },
  doSearch: function() {
    let that = this
    if (that.data.startime!='') {
      this.setData({
        startTime: that.data.startime,
      })
    }
    if (that.data.endtime != '') {
      this.setData({
        endTime: that.data.endtime,
      })
    }
    if (that.data.man != '') {
      this.setData({
        userName: that.data.man,
      })
    }
    if (that.data.coupon != '') {
      this.setData({
        couponName: that.data.coupon,
      })
    }
    this.setData({
      showModalStatus: false,
    })
    this.getCouponInfo();
    this.getCouponTotal();
  },
  datepick:function(e) {
    console.log(e);
   if(e.currentTarget.dataset.type=='start') {
     this.setData({
       startime: e.detail.value
     })
    } else if (e.currentTarget.dataset.type == 'end'){
     this.setData({
       endtime: e.detail.value
     })
    }
   
  } 
})