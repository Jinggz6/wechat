// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '',
    location_city: '',
    get_time: '',
    cue_word: '',
    tmp: '',
    cond_txt: '',
    wind_dir: '',
    wind_sc: '',
    fl: '',
    tmp_max: '',
    tmp_min: '',
    cond_code_d: '',
    cond_txt_d: '',
    tmp_max_m: '',
    tmp_min_m: '',
    cond_code_d_m: '',
    cond_txt_d_m: '',
    hum: '',
    cloud: '',
    pres: '',
    vis: '',
    wind_deg: '',
    pcpn: '',
    wind_spd: '',
    future: [],
    lifeindex: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.weiZhi(options);
    this.getUserOpenId();
    // console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    var options = {};
    that.weiZhi(options);
    that.getUserOpenId();
    // 小程序提供的api，通知页面停止下拉刷新效果
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //用户登录
  getUserOpenId: function(e) {
    wx.login({
      success: res => {
        // console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          method: "POST",
          url: app.globalData.apiUrl + '/GetUserOpenid', // 仅为示例，并非真实的接口地址
          data: {
            wxcode: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            // console.log(res.data.data)
            wx.setStorageSync("user_id", res.data.data);
          }
        })
      }
    })
  },

  //获取用户位置（经纬度）
  weiZhi: function(options) {
    var truedata = JSON.stringify(options);
    var that = this;
    if (truedata == '{}') {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          wx.setStorageSync("latitude", latitude);
          wx.setStorageSync("longitude", longitude);
          // console.log(latitude);
          // console.log(longitude);
          that.getUserCity(latitude, longitude);
        },
        fail() {
          wx.showToast({
            title: '请在【我的】页面授权位置信息并下拉刷新',
            icon: 'none',
            duration: 5000
          });
        },
      })
    } else {
      var latitude = options.lat;
      var longitude = options.lng;
      wx.setStorageSync("latitude", latitude);
      wx.setStorageSync("longitude", longitude);
      that.getUserCity(latitude, longitude);
    }
  },

  //获取用户地理位置（城市）
  getUserCity: function(latitude, longitude) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    var that = this;
    // var lat = wx.getStorageSync('latitude');
    // var longit = wx.getStorageSync('longitude');
    wx.request({
      method: "POST",
      url: app.globalData.apiUrl + '/GetCityName', // 仅为示例，并非真实的接口地址
      data: {
        latitude: latitude,
        longitude: longitude,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        if (res.data.code == 1) {
          that.setData({
            location_city: res.data.data.location_city,
            province: res.data.data.province,
            get_time: res.data.data.gettime,
            cue_word: res.data.data.cue_word,
          });
          that.getWeatherList(latitude, longitude);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '请下拉刷新或重新进入小程序',
            icon: 'none',
            duration: 5000
          });
        }
      }
    })
  },

  //获取用户天气集合预报
  getWeatherList: function(latitude, longitude) {
    var that = this;
    // var latitudes = wx.getStorageSync('latitude');
    // var longitudes = wx.getStorageSync('longitude');
    wx.request({
      method: "POST",
      url: app.globalData.apiUrl + '/WeatherGather', // 仅为示例，并非真实的接口地址
      data: {
        latitude: latitude,
        longitude: longitude,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        if (res.data.code == 1) {
          // console.log(1)
          that.setData({
            tmp: res.data.data.tmp,
            cond_txt: res.data.data.cond_txt,
            wind_dir: res.data.data.wind_dir,
            wind_sc: res.data.data.wind_sc,
            hum: res.data.data.hum,
            cloud: res.data.data.cloud,
            pres: res.data.data.pres,
            vis: res.data.data.vis,
            wind_deg: res.data.data.wind_deg,
            pcpn: res.data.data.pcpn,
            wind_spd: res.data.data.wind_spd,
            fl: res.data.data.fl,
            tmp_max: res.data.weather[0].tmp_max,
            tmp_min: res.data.weather[0].tmp_min,
            cond_txt_d: res.data.weather[0].cond_txt_d,
            cond_code_d: res.data.weather[0].cond_code_d,
            tmp_max_m: res.data.weather[1].tmp_max,
            tmp_min_m: res.data.weather[1].tmp_min,
            cond_txt_d_m: res.data.weather[1].cond_txt_d,
            cond_code_d_m: res.data.weather[1].cond_code_d,
            future: res.data.weather,
            lifeindex: res.data.lifeindex,
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '请下拉刷新或重新进入小程序',
            icon: 'none',
            duration: 5000
          });
        }
      }
    })
  },

  // 搜索页面
  skip_page: function(e) {
    wx.switchTab({
      url: '/pages/search/search',
    })
  },

  // 点击生活指数
  click_button: function(e) {
    // console.log(e.currentTarget.dataset.name);
    wx.showModal({
      title: '温馨提示',
      content: e.currentTarget.dataset.name,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#6666FF',
    });
  },

  // 点击分享图片
  share_pic: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    var that = this;
    var lat = wx.getStorageSync('latitude');
    var longit = wx.getStorageSync('longitude');
    wx.request({
      method: "GET",
      url: app.globalData.apiUrl + '/GetShareImg', // 仅为示例，并非真实的接口地址
      data: {
        latitude: lat,
        longitude: longit,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        if (res.data.code == 1) {
          wx.hideLoading();
          wx.previewImage({
            current: res.data.data, // 当前显示图片的http链接
            urls: [res.data.data] // 需要预览的图片http链接列表
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '请重新点击截图',
            icon: 'none',
            duration: 5000
          });
        }
      }
    });
  },
})