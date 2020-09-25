const AUTH = require('../../utils/auth');
const app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        user: {},
        wxlogin: false,
        iszhezhao: true
    },    
    onLoad() {
        this.setData({
            user: wx.getStorageSync('me'),
            wxlogin: false
        });           
        console.log(this.data.user)
        if(this.data.user == '') {
            console.log('用户信息为空');
            setTimeout(() => {
                this.setData({
                    user: wx.getStorageSync('me')
                });                 
            }, 200);
        }

        // if(this.data.user.address.fullname == undefined) {
        //     console.log('没有地址');
        //     this.logout();
        // }
        


        // if (app.globalData.userInfo) {
        //     this.setData({
        //         userInfo: app.globalData.userInfo,
        //         hasUserInfo: true,
        //     });
        // }
        // else if (this.data.canIUse) {
        //     app.userInfoReadyCallback = res => {
        //         this.setData({
        //             userInfo: res.userInfo,
        //             hasUserInfo: true,
        //         });
        //     };
        // }
        // else {
        //     wx.getUserInfo({
        //         success: res => {
        //             app.globalData.userInfo = res.userInfo;
        //             this.setData({
        //                 userInfo: res.userInfo,
        //                 hasUserInfo: true,
        //             });
        //         },
        //     });
        // }
    },

    getUserInfo(e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
        });
    },
    logout() {
        wx.removeStorageSync('me');
        wx.removeStorageSync('token');
        wx.removeStorageSync('tuijian');
        wx.redirectTo({
            url: '/pages/login/login'
        })
    },

      /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        console.log(res);
        this.setData({
            iszhezhao: false
        })
        // this.fetchShops(res.latitude, res.longitude, '')
      },
      fail: (e) => {
        console.error(e)
        this.setData({
            iszhezhao: true
        })
        AUTH.checkAndAuthorize('scope.userLocation')
      }
    })    
  },
});