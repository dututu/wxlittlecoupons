// pages/publish/publish.js
var app = getApp()
let common = require('../../assets/js/common');
let util = require('../../utils/util.js'); 
Page({
    data: {
        // ui初始参数
      basicShow: true,
      basicWords: '收起',
      basicDegree: '',
      timeShow: true,
      timeWords: '收起',
      timeDegree: 0,
      extShow: true,
      extWords: '收起',
      extDegree: 0,
      couponUnit: '元',
      ableStoreAdd:true,
      couponType: [
        { name: 1, value: '代金券', checked: 'true' },
        { name: 2, value: '折扣券' },
      ],
        //手机号
        surplus_money:0,
        needrecharge:0,
        needrecharged:0,
        mobiled:true,
        getphone:true,
        //充值
        checkSum:true,
        chongzhi:true,
        recharge:false,
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
            imgSrc: '',
            index: 2,
        }, {
            name: '娱乐',
            isOpen: false,
            imgSrc: '',
            index: 3
        }, {
            name: '酒店',
            isOpen: false,
            imgSrc: '',
            index: 4
        }, {
            name: '服饰',
            isOpen: false,
            imgSrc: '',
            index: 5
        }, {
            name: '教育',
            isOpen: false,
            imgSrc: '',
            index: 6
        }, {
            name: '丽人',
            isOpen: false,
            imgSrc: '',
            index: 7
        }, {
          name: '电影',
          isOpen: false,
          imgSrc: '',
          index: 9
        }, {
          name: '购物',
          isOpen: false,
          imgSrc: '',
          index: 10
        }, {
          name: '亲子',
          isOpen: false,
          imgSrc: '',
          index: 11
        }, {
            name: '其他',
            isOpen: false,
            imgSrc: '',
            index: 8
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
        name:'',
        startDate: '',
        startTime: true,
        endDate: '',
        endTime: true,
        typeText: '',
        type: false,
        typeShow: true,
        week: false,
        weekText: '周一至周日',
        weekIndex: '0',
        weekShow: true,
        choose: false,
        chooseText: '全天',
        chooseIndex: '3',
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
        num:'',
        publish:true,
        max:'',
        form_id:''
    },
    bindPickerChange: function (e) {
      let that = this
      console.log(e);
      if(e.currentTarget.id=='week') {
        that.setData({
          weekText: that.data.weekList[e.detail.value].name,
          weekIndex: e.detail.value
        })
      } else if (e.currentTarget.id =='time') {
        that.setData({
          chooseText: that.data.chooseList[e.detail.value].name,
          chooseIndex: e.detail.value
        })
      } else if (e.currentTarget.id == 'type') {
        that.setData({
          typeText: that.data.typeList[e.detail.value].name,
          typeIndex: that.data.typeList[e.detail.value].index
        })
      }
    },
    radioChange: function (e) {
      let that = this
      if (e.detail.value == 2) {
        that.setData({
          couponUnit: '折',
          prefer_type_Index:1
        })
      } else {
        that.setData({
          couponUnit: '元',
          prefer_type_Index:0
        })
      }
    },
    fold: function (e) {
      let that = this
      if (e.currentTarget.id == 'basic') {
        that.setData({
          basicShow: !that.data.basicShow,
        })
        if (that.data.basicShow) {
          that.setData({
            basicWords: '收起',
            basicDegree: ''
          })
        } else {
          that.setData({
            basicWords: '展开',
            basicDegree: 'rotate(180deg)'
          })
        }
      } else if (e.currentTarget.id == 'time') {
        that.setData({
          timeShow: !that.data.timeShow
        })
        if (that.data.timeShow) {
          that.setData({
            timeWords: '收起',
            timeDegree: ''
          })
        } else {
          that.setData({
            timeWords: '展开',
            timeDegree: 'rotate(180deg)'
          })
        }
      } else if (e.currentTarget.id == 'ext') {
        that.setData({
          extShow: !that.data.extShow
        })
        if (that.data.extShow) {
          that.setData({
            extWords: '收起',
            extDegree: ''
          })
        } else {
          that.setData({
            extWords: '展开',
            extDegree: 'rotate(180deg)'
          })
        }
      }
    },
    intro: function () {
      this.setData({
        showAmountModal: {
          showModal: 'showModal',
          showMask: 'showMask',
        }
      });
    },
    clointro: function () {
      this.setData({
        showAmountModal: {
          showModal: 'hideModal',
          showMask: 'hideMask',
        }
      });
    },
    onLoad: function (options) {
      let that = this
      wx.hideShareMenu()
      if(options.id!=undefined) {
        let coupon_id = options.id;
        common.get('/coupon/infofromid', {
          id:coupon_id,
        }).then(res=>{
          console.log(res.data.data);
          that.setData({
            couponId: options.id,
            name: res.data.data.name,
            typeText: res.data.data.typetext,
            typeIndex: res.data.data.type,
            typeShow: false,
            saleText: res.data.data.prefertext,
            sale: false,
            prefer_type_Index: res.data.data.prefer_index-1,
            countPrice: res.data.data.prefer_value*10,
            num: res.data.data.total,
            startTime:false,
            endTime:false,
            startDate: res.data.data.start,
            endDate: res.data.data.end,
            weekShow: false,
            weekText: res.data.data.weektext,
            weekIndex: res.data.data.week,
            chooseText: res.data.data.timetext,
            chooseIndex: res.data.data.time-1,
            chooseShow: false,
            max: res.data.data.times,
            des: res.data.data.limit,
            key: res.data.data.keywords,
            price: res.data.data.price,
            tel: res.data.data.phone,
            add: res.data.data.address,
            longitude: res.data.data.lng,
            latitude: res.data.data.lat,
            image_photo: res.data.data.img,
            button: true,
            imgId: res.data.data.img.substr(res.data.data.img.lastIndexOf('/') + 1),
            imgShow: false
          })
          console.log(11111);
        }).catch(res=>{
          console.log(res);
        })
      }
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
          },
          getphone:true
        });
      } else {
        this.setData({
          getphone: false
        })
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
      //验证
      this.WxValidate = app.WxValidate({
        inputName: {
          required: true,
          // minlength: 2,
          maxlength: 15,
        },
        //行业
        type: {
          required: true,
        },
        //折扣
        inputCount: {
          required: true,
          number: true,
          range:[
            0,
            999.99
          ],
        },
        //发放数量
        inputNum: {
          required: true,
          number: true,
        },
        //开始时间
        startTime: {
          required: true,
        },
        //结束时间
        endTime: {
          required: true,
        },
        //周几可用
        week: {
          required: true,
        },
        //可用时段
        time: {
          required: true,
        },
        //最大领取量限制
        max: {
          range: [
            1,
            99
          ],
          digits: true,
        },
        phone: {
          required: true,
          // tel: true         
        },
        add: {
          required: true,
        },
        image: {
          required: true,
        },
        //
        
      }, {
          inputName: {
            required: '输入优惠券名称',
            maxlength: '输入的优惠券名称不多于15个字',
          },
          inputCount: {
            required: '请填写优惠值',
            number:'优惠值必须是数字',
            range:'优惠值必须介于0~999.99之间',
          },
          type: {
            required: '请选择行业类型',
          },
          inputNum: {
            required: '数量不能为空',
            number: '数量必须为数字',
          },
          //开始时间
          startTime: {
            required: '请选择开始日期',
          },
          //结束时间
          endTime: {
            required: '请选择过期日期',
          },
          //周几可用
          week: {
            required: '请填写周几可用',
          },
          //可用时段
          time: {
            required: '请填写可用时间段',
          },
          max: {
            digits: '最大领取量请输入整数',
            range: '最大领取量请输入1~99的整数',
          },
          phone: {
            required: '请填写联系电话',
          },
          add: {
            required: '请填写地址',
          },
          image: {
            required: '请上传图片',
          },
          
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
    checkLocation:function() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation'] === false) {
            wx.navigateTo({
              url: '/pages/authorize/authorize',
            })
          }
        }
      })
    },
    // 点击获取位置的时候获取到经纬度
    getLon: function () {
        let _this = this;
        this.checkLocation();
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                console.log('定位执行了')
                wx.chooseLocation({
                    success: function (res) {
                        _this.setData({
                            latitude: res.latitude,
                            longitude: res.longitude,
                            add: res.name,
                            storeAdd : res.name,
                            ableStoreAdd:false
                        })
                    },
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
    inputMax: function(e) {
        this.setData({
          max: e.detail.value
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
                  url: common.updateUrl,
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
    submit: function(e) {
      console.log(e.detail.formId);
      let form_id = e.detail.formId;
      let _this = this
      _this.setData({
        form_id: e.detail.formId
      })
      if (!this.WxValidate.checkForm(e)) {
         const error = this.WxValidate.errorList[0]
         app.showToast(error.msg, _this, 2000)
         return false
       } else {
        if (_this.data.checkSum == true) {
          common.post('/surplusmoney', {
            unique_id: this.data.unique_id,
            status: 2
          }).then(res => {
            _this.setData({
              checkSum: false
            })
            _this.setData({
              surplus_money: res.data.surplus_money
            })
            //校验优惠券数量和金额(非强制...)//用户输入数量为0的时候会有bug
            let docharge = Math.ceil(_this.data.num * 0.2) * 3
            if (res.data.surplus_money >= docharge) {
              //余额够传1
              _this.aftersubmit(1);
            } else {
              let needrecharge = (docharge - parseInt(res.data.surplus_money)).toFixed(2);
              _this.setData({
                needrecharged: needrecharge
              })
              _this.setData({
                needrecharge: needrecharge
              })
              _this.setData({
                recharge: true,
                form_id: e.detail.formId
              })
            }
          }).catch(res => {
            let reason = [];
            for (let i in res.data.errors) {
              reason.push(res.data.errors[i][0])
            }
            app.showToast(reason[0] || res.data.message, this, 2000)
          })
        } else {
          //如果没跳转再次提交
          _this.aftersubmit(2);
        }
      }
      //判断营销资金 
    },
    aftersubmit: function (flag) {
        let _this = this
        if (this.data.name == undefined) {
          app.showToast('输入优惠券名称', this, 2000)
        } else if (this.data.name.length > 15) {
          app.showToast('输入的优惠券名称应少于15个字', this, 2000)
        } else {
            let price = this.data.price || 0
            let max = this.data.max > 0 ? this.data.max : 99
            let countPrice;
            if (this.data.prefer_type_Index == 1) {
              countPrice = (this.data.countPrice / 10).toFixed(1)
            } else { 
              countPrice = this.data.countPrice;
            }
            if(_this.data.publish){
              _this.data.publish=false
              common.post('/coupon/publish', {
                id: this.data.couponId || '',
                unique_id: this.data.unique_id,
                name: this.data.name,
                type: this.data.typeIndex,
                prefer_type: this.data.prefer_type_Index + 1,
                prefer_value: countPrice,
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
                price: price,
                max: max,
                form_id: this.data.form_id
                // phone: 18132020205,
                // limit: '无',
                // keyword: '蛋糕',
                // price: 0.05
              }).then(e => {
                _this.setData({
                      checkSum: true
                })
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
                  imgShow: true,
                  max: '',
                })
                if(flag==1) {
                  //资金够
                  app.showToast('提交成功，请等待审核通过', _this, 2000)
                } else if(flag==2) {
                  //再次提交
                  app.showToast('提交成功，请等待审核通过', _this, 2000)
                } else if(flag==3) {
                  app.showToast('支付成功，正在提交优惠券信息', _this, 2000)
                  //支付成功
                } else if(flag==4) {
                  //取消支付
                  app.showToast('如果需要，请在奖励金->钱包->营销资金进行充值，正在提交优惠券信息', _this, 3000)
                }
               
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/mine/mine'
                  })
                },3000)
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
          //session没过
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
              wx.setData({
                getphone:true
              })
            }
          }).catch(res => {
            wx.setStorage({
              key: "mobiled",
              data: false
            })
            wx.setData({
              getphone: false
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
        this.aftersubmit(4);
    },
    inputMoney(e){
        this.setData({
          needrecharge:e.detail.value
        })
      },
      pay(){
        let _this=this
        if(_this.data.chongzhi){
          _this.data.chongzhi=false
          common.post('/member/recharge', {
            unique_id: _this.data.unique_id,
            money: _this.data.needrecharge
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
                  })
                  _this.aftersubmit(3);
                },
                'fail': function (res) {
                  console.log(res)
                  //支付失败重新跳起支付
                  app.showToast('支付失败，请重新支付', _this, 2000)
                  setTimeout(function () {
                    _this.setData({
                      recharge: true
                    })
                  }, 2000)
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