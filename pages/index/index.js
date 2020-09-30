const AUTH = require('../../utils/auth');
const app = getApp();
Page({
    data: {
        userInfo: {},
        user: {},
        wxlogin: false,
        iszhezhao: true,
    },    
    onLoad() {

        // console.log(app);
        // console.log(this.data.wxlogin);
        // if(this.data.user.address.fullname == undefined) {
        //     console.log('没有地址');
        //     this.logout();
        // }
        


    },
    processLogin(e) { //  登录操作
        // console.log(e);
        AUTH.bindGetPhoneNumber(e);
      },
    cancelLogin() {
        // console.log('暂不登录');
        wx.showToast({
          title: '不进行登录，将无法正常使用！',
          icon: 'none',
          duration: 3000,
          mask: true
        })
        this.setData({
          wxlogin: false
        })
      },
    logout() {
        wx.removeStorageSync('me');
        wx.removeStorageSync('token');
        wx.removeStorageSync('tuijian');
        this.setData({
            wxlogin: false
        })
    },
    getLocation() {
      wx.getLocation({
        type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: (res) => {
          this.setData({
              iszhezhao: false
          })
          app.initSocket();
        },
        fail: (e) => {
          console.error(e)
          // this.setData({
          //     iszhezhao: true
          // })
          AUTH.checkAndAuthorize('scope.userLocation')
        }
      })
    },

      /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('显示页面')
    if(wx.getStorageSync('token') && wx.getStorageSync('me')) {
      this.setData({
          wxlogin: true,
      });    
      this.setData({
          user: wx.getStorageSync('me'),
      });           
      // console.log(this.data.user)
      if(this.data.user == '') {
          console.log('用户信息为空');
          setTimeout(() => {
              this.setData({
                  user: wx.getStorageSync('me')
              });
          }, 200);
      }
      wx.getSetting({
        success: (res) => { 
          if (res.authSetting["scope.userLocation"]) {
            // console.log("已授权");
            this.setData({
              iszhezhao: false
            })
          }
          else{
            // console.log("未授权");
            this.setData({
              iszhezhao: true
            })
            this.getLocation();
          }
        }
      })
    }
    if(this.data.wxlogin) {
      // this.getLocation();
    }
  },
});