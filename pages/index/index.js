const AUTH = require('../../utils/auth');
const app = getApp();
Page({
    data: {
        userInfo: {},
        user: {},
        wxlogin: true,
        iszhezhao: false,
    },    
    onLoad() {

        // console.log(app);
        // console.log(this.data.wxlogin);
        // if(this.data.user.address.fullname == undefined) {
        //     console.log('没有地址');
        //     this.logout();
        // }
        


    },
    goLogin() {
      this.setData({
        wxlogin: false,
      });  
    },
    linkTo(url) {
      // console.log(url);
      console.log(url.currentTarget.dataset.url);
      if(!wx.getStorageSync('token') || !wx.getStorageSync('me')) {
        wx.showToast({
          title: '登录缓存被清除，请重新登录',
          icon: 'none'
        })
        // console.log('没登录');
        this.setData({
          wxlogin: false,
          iszhezhao: false,
          user: {}
        });
        return ;
      }
      if(url.currentTarget.dataset.url) {
        wx.navigateTo({
            url: url.currentTarget.dataset.url
        })
      }

    },
    processLogin(e) { //  登录操作
        // console.log(e);
        AUTH.bindGetPhoneNumber(e);
      },
    logout() {
        wx.removeStorageSync('me');
        wx.removeStorageSync('token');
        wx.removeStorageSync('tuijian');
        this.setData({
            // wxlogin: false,
            user: {}
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
  initinfo() {
      this.setData({
          wxlogin: true,
      });   
      this.setData({
        user: wx.getStorageSync('me'),
      });           
    // console.log(this.data.user)
    if(this.data.user == {}) {
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
    },

      /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('显示页面')
    if(wx.getStorageSync('token') && wx.getStorageSync('me')) {
      this.initinfo();
      // this.setData({
      //     wxlogin: true,
      // });    
      // this.setData({
      //     user: wx.getStorageSync('me'),
      // });           
      // // console.log(this.data.user)
      // if(this.data.user == '') {
      //     console.log('用户信息为空');
      //     setTimeout(() => {
      //         this.setData({
      //             user: wx.getStorageSync('me')
      //         });
      //     }, 200);
      // }
      // wx.getSetting({
      //   success: (res) => { 
      //     if (res.authSetting["scope.userLocation"]) {
      //       // console.log("已授权");
      //       this.setData({
      //         iszhezhao: false
      //       })
      //     }
      //     else{
      //       // console.log("未授权");
      //       this.setData({
      //         iszhezhao: true
      //       })
      //       this.getLocation();
      //     }
      //   }
      // })
    }
    if(this.data.wxlogin) {
      // this.getLocation();
    }
  },
});