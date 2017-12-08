// pages/publish/publish.js
var app = getApp()
let common = require('../../assets/js/common');
let util = require('../../utils/util.js'); 
Page({
    data: {
        //手机号
        mobiled:true,
        //充值
        chongzhi:true,
        money:'300',
        recharge:false,
        items: [
          { name: '300', value: '300', checked: 'true'  },
          { name: '600', value: '600',},
          { name: '900', value: '900' },
          { name: '其它金额', value: '其它金额' },
        ],
        //协议
        showAmountModal:{
          showModal:'hideModal',
          showMask:'hideMask',
        },
       
        //
        currentTab: 1,
        publishShow: true,
        publishList: [],
        isShowToast:false,
        typeList: [{
            name: '美食',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '娱乐',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '酒店',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '服饰',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '教育',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '丽人',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '其他',
            isOpen: false,
            imgSrc: ''
        },],
        saleList: [{
            name: '元',
            isOpen: true,
            imgSrc: ''
        }, {
            name: '折',
            isOpen: false,
            imgSrc: ''
        },],
        weekList: [{
            name: '周一至周日',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '周一至周五',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '周六至周日',
            isOpen: false,
            imgSrc: ''
        }],
        chooseList: [{
            name: '上午',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '下午',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '晚上',
            isOpen: false,
            imgSrc: ''
        }, {
            name: '全天',
            isOpen: false,
            imgSrc: ''
        }],
        startDate: '',
        startTime: true,
        endDate: '',
        endTime: true,
        typeText: '',
        type: false,
        typeShow: true,
        week: false,
        weekTetx: '',
        weekShow: true,
        choose: false,
        chooseText: '',
        chooseShow: true,
        sale: false,
        saleText: '元',
        imgShow: true,
        prefer_type_Index: 0,
        shijian: false,
        page: 1,
        add: '',
        info: [],
        total: null,
        scrollStyle: {},
        button: false,
        price:'',
        count:'',
        publish:true
    },
    onLoad: function (options) {
      var time = util.formatTime(new Date());
      time = time.split(" ");
      this.setData({
        time: time[0].split("/").join("-")
      });
      let mobiled  = wx.getStorageSync('mobiled') || false;
      if(!mobiled) {
         this.setData({
          showAmountModal:{
            showModal:'showModal',
            showMask:'showMask',
          }
        });
      }
        this.setData({
          unique_id: wx.getStorageSync('unique_id')
        })
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
    onShareAppMessage: function () {
        return {
            title: '附近优惠券',
            path: '/pages/publish/publish'
        }
    },
    // 页面滑动到底部加载更多
    bindscrolltoupper: function () {
        if (this.data.page <= this.data.total) {
            this.getPublish(this.data.page);
        }
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
                console.log('定位执行了')
                wx.chooseLocation({
                    success: function (res) {
                        _this.setData({
                            latitude: res.latitude,
                            longitude: res.longitude,
                            add: res.name
                        })
                    }
                })
            }
        })
    },
    getPublish: function (page) {
        let _this = this
        common.get('/coupon/alycoupons', {
          unique_id: this.data.unique_id,
            page: page
        }).then(res => {
            // if (res.data.data.length == 0) {
            //     common.get('/user/info', {
            //       id: _this.data.unique_id
            //     }).then(res => {
            //         common.setStorage('user', res.data.data)
            //     })
            // }
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
        this.setData({
            currentTab: 1
        })
    },
    // 点击tab栏切换
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    // 点击弹出行业类别盒子
    bindType: function () {
        this.setData({
            type: !this.data.type
        })
    },
    // 点击选择行业类型中的每一项
    changeType: function (e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.typeList;
        for (let i = 0, l = list.length; i < l; i++) {
            let _i = list[i];
            _i.isOpen = false;
            _i.imgSrc = "";
        }
        this.setData({
            typeList: list
        })
        list[index].isOpen = true;
        list[index].imgSrc = "../../imgs/duigou.png"
        this.setData({
            typeList: list,
            typeText: list[index].name,
            type: false,
            typeShow: false,
            typeIndex: index + 2
        })
    },
    // 点击弹出选择周几弹出框
    bindWeek: function () {
        this.setData({
            week: !this.data.week
        })
    },
    // 点击弹出框选择周几中的每一项
    changeWeek: function (e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.weekList;
        for (let i = 0, l = list.length; i < l; i++) {
            let _i = list[i];
            _i.isOpen = false;
            _i.imgSrc = "";
        }
        this.setData({
            weekList: list
        })
        list[index].isOpen = true;
        list[index].imgSrc = "../../imgs/duigou.png"
        this.setData({
            weekList: list,
            weekText: list[index].name,
            week: false,
            weekShow: false,
            weekIndex: index
        })
    },
    // 点击弹出选择可用时间段
    bindChoose: function () {
        this.setData({
            shijian: !this.data.shijian
        })
    },
    // 点击选择可用时间段中的每一项
    changeChoose: function (e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.chooseList;
        for (let i = 0, l = list.length; i < l; i++) {
            let _i = list[i];
            _i.isOpen = false;
            _i.imgSrc = "";
        }
        this.setData({
            chooseList: list
        })
        list[index].isOpen = true;
        list[index].imgSrc = "../../imgs/duigou.png"
        this.setData({
            shijian: true,
            chooseList: list,
            chooseText: list[index].name,
            shijian: false,
            chooseShow: false,
            chooseIndex: index
        })
    },
    // 点击显示元还是折
    bindSale: function () {
        this.setData({
            sale: !this.data.sale
        })
    },
    // 点击显示元还是折中的每一项
    changeSale: function (e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.saleList;
        for (let i = 0, l = list.length; i < l; i++) {
            let _i = list[i];
            _i.isOpen = false;
            _i.imgSrc = "";
        }
        this.setData({
            saleList: list
        })
        list[index].isOpen = true;
        list[index].imgSrc = "../../imgs/duigou.png"
        this.setData({
            saleList: list,
            saleText: list[index].name,
            sale: false,
            prefer_type_Index: index
        })
    },
    // 点击选择开始时间
    bindStartChange: function (e) {
        this.setData({
            startTime: false,
            start: e.detail.value
        })
    },
    bindEndChange: function (e) {
        this.setData({
            endTime: false,
            end: e.detail.value
        })
    },
    // 点击选择开始日期
    bindDateChange: function (e) {
        this.setData({
            startTime: false,
            startDate: e.detail.value
        })
    },
    // 点击选择结束日期
    bindEndDate: function (e) {
        this.setData({
            endTime: false,
            endDate: e.detail.value
        })
    },
    // 输入门店名称
    inputName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    // 输入优惠金额
    inputCount: function (e) {
        this.setData({
            countPrice: e.detail.value
        })
    },
    // 输入优惠券张数
    inputNum: function (e) {
        this.setData({
            num: e.detail.value
        })
    },
    // 输入使用限制
    inputDes: function (e) {
        this.setData({
            des: e.detail.value
        })
    },
    // 输入关键字
    inputKey: function (e) {
        this.setData({
            key: e.detail.value
        })
    },
    // 输入门店电话
    inputTel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    // 输入门店地址
    inputAdd: function (e) {
        this.setData({
            add: e.detail.value
        })
    },
    // 输入优惠券价格
    inputPrice(e){
      this.setData({
        price:e.detail.value
      })
    },
    // 点击上传头像
    chooseImg: function () {
        let _this = this;
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                _this.setData({
                    image_photo: res.tempFilePaths[0],
                    imgShow: false
                })
                wx.uploadFile({
                  url: "https://zm.wehome.com.cn",
                    filePath: _this.data.image_photo,
                    name: 'img',
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    success: function (res) {
                        console.log(JSON.parse(res.data))
                        let info = JSON.parse(res.data)
                        if (info.code == 100) {
                            _this.setData({
                                imgId: info.data,
                                button: true
                            })
                        } else if (info.code == 120) {
                            wx.showToast({
                                title: info.msg,
                                icon: 'fail',
                                duration: 2000
                            })
                        }

                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            }
        })
    },
    // 点击提交的时候执行的函数
    submit: function() {
      let _this = this
      //是否新用户
      let isnew = wx.getStorageSync('isnew') || false;
      //判断是不是新用户
      if (!isnew) {
        _this.setData({
          recharge: true
        })
      } else {
        _this.aftersubmit();
      }
      wx.setStorage({
        key: 'isnew',
        data: true,
      })
    },
    aftersubmit: function () {
        let _this = this
        if (this.data.name == undefined) {
          app.showToast('输入优惠券名称', this, 2000)
        } else if (this.data.name.length > 15) {
          app.showToast('输入的优惠券名称少于15个字', this, 2000)
        } else {
            if(_this.data.publish){
              _this.data.publish=false
              common.post('/coupon/publish', {
                unique_id: this.data.unique_id,
                name: this.data.name,
                type: this.data.typeIndex,
                prefer_type: this.data.prefer_type_Index + 1,
                prefer_value: this.data.countPrice,
                count: this.data.num,
                week: this.data.weekIndex,
                time: parseFloat(this.data.chooseIndex) + 1,
                start: this.data.startDate,
                end: this.data.endDate,
                lng: this.data.longitude,
                lat: this.data.latitude,
                address: this.data.add,
                img: this.data.imgId,
                phone: this.data.tel,
                limit: this.data.des,
                keyword: this.data.key,
                price: this.data.price
                // phone: 18132020205,
                // limit: '无',
                // keyword: '蛋糕',
                // price: 0.05
              }).then(e => {
                setTimeout(function () {
                  _this.setData({
                    publish: true
                  })
                }, 1000)
                _this.setData({
                  name: '',
                  countPrice: '',
                  des: '',
                  tel: '',
                  price: '',
                  key: '',
                  add: '',
                  startTime: true,
                  endTime: true,
                  week: false,
                  prefer_type_Index: 0,
                  shijian: false,
                  button: false,
                  startDate: '',
                  endDate: '',
                  chooseShow: true,
                  weekShow: true,
                  weekText: '',
                  chooseText: '',
                  num: '',
                  typeShow: true,
                  typeText: '',
                  image_photo: '',
                  imgShow: true
                })
                app.showToast('数据已提交,等待审核', _this, 2000)
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/mine/mine'
                  })
                },2000)
              }).catch(res => {
                setTimeout(function(){
                  _this.setData({
                    publish:true
                  })
                },1000)
                let reason = [];
                for (let i in res.data.errors) {
                  reason.push(res.data.errors[i][0])
                }
                console.log(res.data.status_code);
                app.showToast(reason[0] || res.data.message, this, 2000);
                if(res.data.status_code==400) {
                     _this.setData({
                      recharge:true
                    })
                }
              })
            }
            
        }
    },
    showAmountModal:function(e){
        var that = this;
        that.setData({
          showAmountModal:{
            showModal:'showModal',
            showMask:'showMask',
          }
        })
    },
    getPhoneNumber: function(e) {
      var that = this;
      that.setData({
        showAmountModal:{
          showModal:'hideModal',
          showMask:'hideMask',
        }
      });
      wx.checkSession({
        success: function () {
          //session没过期
          common.post('/member/mobile', {
            session_key: wx.getStorageSync('session_key'),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            unique_id: wx.getStorageSync('unique_id'),
            expire:false
          }).then(res => {
            console.log(res);
            if (res.statusCode == 200) {
              wx.setStorage({
                key: "mobiled",
                data: true
              })
            }
          }).catch(res => {
            wx.setStorage({
              key: "mobiled",
              data: false
            })
          })
        },
        fail: function () {
          //登录态过期
          wx.login({
            success: function (res) {
              common.post('/member/mobile', {
                session_key: wx.getStorageSync('session_key'),
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                unique_id: wx.getStorageSync('unique_id'),
                code:res.code,
                expire: true
              }).then(res => {
                console.log(res);
                if (res.statusCode == 200) {
                  wx.setStorage({
                    key: 'session_key',
                    data: res.data.data.data,
                  })
                  wx.setStorage({
                    key: "mobiled",
                    data: true
                  })
                }
              }).catch(res => {
                wx.setStorage({
                  key: "mobiled",
                  data: false
                })
              })
            }
          })
        }
      })
    } ,
     // 关闭充值盒子
    closeRecharge(){
        this.setData({
          recharge:false
        })
    },
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
                  wx.setStorage({
                    key: "isnew",
                    data: true
                  })
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

}) 