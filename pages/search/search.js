// pages/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDingweiCity();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.getDingweiCity();
    // 小程序提供的api，通知页面停止下拉刷新效果
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 搜索框
   */
  search_weathers: function (e) {
    var cityName = e.detail.value;
    this.getJingWeiDu(cityName);
  },

  /**
   * 点击按钮
   */
  search_weather: function (e) {
      var cityName = e.currentTarget.dataset.name;
      this.getJingWeiDu(cityName);
  },

  //获取用户地理位置（城市）
  getDingweiCity: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    var that = this; 
    var lat = wx.getStorageSync('latitude');
    var longit = wx.getStorageSync('longitude');
    wx.request({
      method: "POST",
      url: app.globalData.apiUrl + '/GetCityName', // 仅为示例，并非真实的接口地址
      data: {
        latitude: lat,
        longitude: longit,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          city: res.data.data.polis + '市',
        });
        wx.hideLoading();
      }
    })
  },

  //获取（城市）经纬度
  getJingWeiDu: function (cityName) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    var that = this;
    var cityName = cityName;
    wx.request({
      method: "GET",
      url: app.globalData.apiUrl + '/GetLocation', // 仅为示例，并非真实的接口地址
      data: {
        cityName: cityName,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 1) {
          var lng = res.data.data.lng;
          var lat = res.data.data.lat;
          wx.hideLoading();
          wx.reLaunch({
            url: '/pages/index/index?lng='+ lng + '&lat=' + lat, 
          })          
        } else {
          wx.showToast({
            title: '获取信息失败',
            icon: 'none',
            duration: 5000
          });
          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})