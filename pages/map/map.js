Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      iconPath: "../../imgs/default_head.png",
      id: 1,
      latitude: 39.95936,
      longitude: 116.29845,
      width: 20,
      height: 20
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    // controls: [{
    //   id: 1,
    //   iconPath: '../../imgs/default_head.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onShow:function() {
    this.convertPosition()
  },
  convertPosition:function() {
    this.setData({
      latitude:wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude')
    })
  },
  getLocation: function() {
    //获取用户位置授权
  }
})