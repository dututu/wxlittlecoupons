// pages/money/money.js
var app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, 
    reward:false,
    marketing:false,
    recharge:false,
    isShowToast:false,
    items: [
      { name: '300', value: '300', checked: 'true'  },
      { name: '600', value: '600',},
      { name: '900', value: '900' },
      { name: '其它金额', value: '其它金额' },
    ],
    money:'300',
    page1:1,
    list1:[],
    page2:1,
    list2:[],
    part:false,
    bieMoney:'',
    tixian:true,
    chongzhi:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      page1:1,
      page2:1
    })
    let that=this
    let res = wx.getSystemInfoSync()
    this.setData({
      scrollHeight: res.windowHeight
    })
    this.setData({
      unique_id: wx.getStorageSync('unique_id')
    })
    // 获取总金额
    this.getMoney();
    // 获取可用金额
    this.getPartMoney();
    // 获取奖励资金和营销资金列表
    this.getMoneyList();
  },
  // 获取奖励资金和营销资金列表
  getMoneyList(){
    let _this=this
    common.post('/myawrd',{
      unique_id: this.data.unique_id,
      // unique_id: '1510713639Nakty',
      status: parseFloat(this.data.currentTab) + 1
    }).then(res=>{
      if(this.data.currentTab==0){
        _this.setData({
          list1: res.data.data
        })
      }else {
        _this.setData({
          list2: res.data.data
        })
      }
      
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取可用金额
  getPartMoney(){
    common.post('/surplusmoney',{
      unique_id: this.data.unique_id,
      status: parseFloat(this.data.currentTab)+1
    }).then(res=>{
      this.setData({
        partMoney: res.data.surplus_money
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取总金额
  getMoney() {
    common.get('/totalamount', {
      unique_id: this.data.unique_id
    }).then(res => {
      this.setData({
        totalMoney: res.data.total_amount
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  checkUser: function () {
    let _this = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] === false) {
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        } else {
          _this.withdraw()
        }
      }
    })
  },
  // 点击提现进行提现
  withdraw(){
    let _this=this
    wx.showModal({
      title: '提示',
      content: '确认提现吗?',
      success: function (res) {
        if (res.confirm) {
          if (_this.data.tixian) {
            _this.data.tixian = false
            common.post('/withdrawals', {
              money: _this.data.partMoney,
              unique_id: _this.data.unique_id
            }).then(res => {
              setTimeout(function () {
                _this.setData({
                  tixian: true
                })
              }, 1000)
              app.showToast(res.data.success, _this, 2000)
              // 获取总金额
              _this.getMoney();
              // 获取可用金额
              _this.getPartMoney();
              // 获取列表
              _this.getMoneyList()
            }).catch(res => {
              setTimeout(function () {
                _this.setData({
                  tixian: true
                })
              }, 1000)
              let reason = [];
              for (let i in res.data.errors) {
                reason.push(res.data.errors[i][0])
              }
              app.showToast(reason[0] || res.data.message, _this, 2000)
            })
          }
        }
      }
    })
  },
  // 点击充值进行充值
  pay(){
    let _this=this
    if(_this.data.chongzhi){
      _this.data.chongzhi=false
      common.post('/member/recharge', {
        unique_id: _this.data.unique_id,
        money: _this.data.part == true ? _this.data.bieMoney : _this.data.money
      }).then(res => {
        setTimeout(function () {
          _this.setData({
            chongzhi: true
          })
        }, 1000)
        if (res.data.err_code2 == '200') {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              _this.setData({
                recharge: false,
                bieMoney: ''
              })
              // 获取总金额
              _this.getMoney();
              // 获取可用金额
              _this.getPartMoney();
              // 获取列表
              _this.getMoneyList()
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        } else {
          app.showToast(res.data.err_msg, _this, 2000)
        }
      }).catch(res => {
        setTimeout(function(){
          _this.setData({
            chongzhi:true
          })
        },1000)
        let reason = [];
        for (let i in res.data.errors) {
          reason.push(res.data.errors[i][0])
        }
        app.showToast(reason[0] || res.data.message, this, 2000)
      })
    }
  },
  // 充值自己选择的金额
  inputMoney(e){
    this.setData({
      bieMoney:e.detail.value
    })
  },
  // 点击切换金额
  radioChange: function (e) {
    let _this=this
    if(e.detail.value=='其它金额'){
      _this.setData({
        part:true
      })
      console.log(_this.data.part)
      _this.inputMoney();
    }else {
      _this.setData({
        part:false,
        bieMoney:'',
        money:e.detail.value
      })
    }
  },
  bindDownLoad(){
    if (this.data.currentTab == 0) {
      this.data.page1++
      this.setData({
        page1: this.data.page1
      })
      common.post('/myawrd', {
        unique_id: this.data.unique_id,
        status: parseFloat(this.data.currentTab) + 1,
        page: this.data.page1
      }).then(res => {
        if (res.data.data.length > 0) {
          this.data.list1 = [...this.data.list1, ...res.data.data]
          this.setData({
            list1: this.data.list1
          })
        } else {
          return false
        }
      })
    }else {
      this.data.page2++
      this.setData({
        page2: this.data.page2
      })
      common.post('/myawrd', {
        unique_id: this.data.unique_id,
        status: parseFloat(this.data.currentTab) + 1,
        page: this.data.page2
      }).then(res => {
        if (res.data.data.length > 0) {
          this.data.list2 = [...this.data.list2, ...res.data.data]
          this.setData({
            list2: this.data.list2
          })
        } else {
          return false
        }
      })
    }
  },
  // 切换导航
  swichNav: function (e) {
    var that = this;
    if (e.target.dataset.reward){
      that.setData({
        reward:true
      })
    } else if (e.target.dataset.marketing){
      that.setData({
        marketing:true
      })
    }else {
      if (that.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    }
    // 获取总结额
    this.getMoney();
    // 获取可用余额
    this.getPartMoney();
    // 获取列表
    this.getMoneyList()
  },
  // 关闭奖励资金
  closeReward(){
    this.setData({
      reward:false
    })
  },
  // 关闭营销资金
  closeMas(){
    this.setData({
      marketing:false
    })
  },
  // 点击充值打开盒子
  openRecharge(){
    this.setData({
      recharge:true
    })
  },
  // 关闭充值盒子
  closeRecharge(){
    this.setData({
      recharge:false
    })
  }
})