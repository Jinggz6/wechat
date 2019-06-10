//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    icon:'',
    name:'',
  },
  onLoad: function() {
    this.gainUserInfo();
  },

  gainUserInfo: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    var page = this;
    var userid = wx.getStorageSync('user_id');
    wx.request({
      method: "GET",
      url: app.globalData.apiUrl + '/GainUserInfo', // 仅为示例，并非真实的接口地址
      data: {
        user_id: userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        // 判断是否成功 code=1 或 0
        if (res.data.code == 1) {
          page.setData({
            icon:res.data.data.usericon,
            name:res.data.data.username,
          });
          wx.hideLoading();
        }
      }
    })
  },

  bindGetUserInfo: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    var page = this;
    if (e.detail.userInfo) {
      // console.log(e.detail.userInfo);
      var user_id = wx.getStorageSync('user_id');
      wx.request({
        method: "POST",
        url: app.globalData.apiUrl + '/AddUserInfo', // 仅为示例，并非真实的接口地址
        data: {
          userid: user_id,
          name: e.detail.userInfo.nickName,
          icon: e.detail.userInfo.avatarUrl,
          area: e.detail.userInfo.province + e.detail.userInfo.city,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          // console.log(res.data)
          page.setData({
            icon: res.data.data.usericon,
            name: res.data.data.username,
          });
          page.onLoad();
          wx.hideLoading();
        }
      })
    }
  },
  webUrl: function() {
    wx.showModal({
      title: '博客地址',
      content: 'blog.wechat96.com',
      showCancel: false,
      confirmText: '授人以渔',
      success(res) {
        console.log('确定')
      }
    })
  }

})