let Util = require('./util')

String.prototype.get_query= function(key) {
  if (this.length > 0) {
    var searchList = null;
    var val = '';
    var reg = new RegExp('(' + key + ')=([\\w\\W]*)');
    if (this.valueOf().indexOf('&') > -1) {
      searchList = this.valueOf().split('&');
    } else {
      searchList = [this.valueOf()];
    }
    for (var i = 0; i < searchList.length; i++) {
      if (reg.test(searchList[i])) {
        val = RegExp.$2;
        break;
      }
    }
    return val;
  }
};
class Common {
  checkAuthStatus = false
  userQrCode = 'https://zm.wehome.com.cn/api/app/code/spread?status=1&id=';
  updateUrl = 'https://zm.wehome.com.cn';
  couponCode = 'https://zm.wehome.com.cn/api/app/code/coupon?type=1&member_id=';
  fileUrl = 'https://coufile.wehome.com.cn/coupons/'
  constructor() {
    this.apiBaseUrl = 'https://zm.wehome.com.cn/api';
    //this.apiBaseUrl = 'https://coupons3.network.weixingzpt.com/api'
  }

  /**
   *  get
   */
  get(url, data) {
    return Util.request({
      url: this.apiBaseUrl + url,
      data: data
    })

  }

  /**
   * post
   */
  post(url, data) {
    return Util.request({
      url: this.apiBaseUrl + url,
      data: data,
      method: 'POST'
    })

  }

  getLocation() {
    return Util.doLocation()

  }

  setStorage(key, data) {
    return Util.setStorage({
      key: key,
      data: data
    })
  }


  getStorage(key) {
    return Util.getStorage({
      key: key
    })
  }


  print(key) {
    console.log(key);
  }
  // 判断状态吗
  checkStatusCode(statusCode, callback) {
    let code = String(statusCode);
    try {
      if (code.length === 3) {
        if (code.charAt(0) == 2) {
          code = null;
          return true;
        } else {
          code = null;
          return false;
        }
      }
      throw code + " not normal status;"
    }
    catch (error) {
      callback && callback.apply(this, [code, error]);
    }
  }


  /**
   * check user is auth location and auth user info
   */
  checkAuth(reLoad, options) {
    // // return

    // if (this.checkAuthStatus) return

    // this.checkAuthStatus = true
    // let that = this
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope.userLocation'] === false) {
    //       wx.navigateTo({
    //         url: '/pages/authorize/authorize',
    //       })
    //     }
    //   }
    // })
    // if (this.checkAuthStatus) return

    // this.checkAuthStatus = true
    // let that = this
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo'] === false || res.authSetting['scope.userLocation'] === false) {
    //       wx.openSetting({
    //         success: (res) => {
    //           console.log(options)
    //           reLoad(options)
    //         },
    //         complete: () => {
    //           that.checkAuthStatus = false
    //         }
    //       })
    //     }
    //   }
    // })
  }
}

module.exports = new Common