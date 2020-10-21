//app.js
var mqtt = require('./utils/mqtt');
var AUTH = require('./utils/auth');
var Config = require('./config');
App({
  data: {
    client: {},
  },
  initSocket() {
    //小程序中只能用wxs://开头
      // var url = 'wxs://iot.shlj.ltd/mqtt';//替换自己的请求地址
      var client = mqtt.connect(Config.mqttLink, {
        // clientId: "8084",
        username: 'test',
        password: 'test',
      });
      this.data.client = client;
      //建立连接
      this.data.client.on('connect', () => {
      // console.log("建立连接")
      wx.showToast({
        title: '已连接后台',
      })
      this.goXunhuan();
    })

    this.data.client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
 
    this.data.client.on('error', (error) => {
      console.log('连接失败:', error)

      this.data.client.on('connect',function(){
        console.log('连接成功');
        this.goXunhuan();
      })
    })
  },
  delConnect() {
    if(!this.data.client) return ;
    // console.log('要断开连接')
    let that = this;
    this.data.client.end(true, {reasonCode: 123456});
    if(this.data.client.disconnecting) {
      console.log('断开了连接')
    }
  },

  goXunhuan() {
    if(this.data.myVar) {
      console.log(this.data.myVar)
      clearInterval(this.data.myVar);
      console.log("有循环")
    }
    this.xiaoxi();
    this.data.myVar = setInterval(() => {
      this.xiaoxi();
    }, 300000);
  },
  xiaoxi() {
    const user = wx.getStorageSync('me');
    const mes = {
      id: user.id,
      name: user.name,
      phonenumber: user.phonenumber,
      lat: '',
      lng: '',
      // timess: new Date()
    };
    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        mes.lat = res.latitude
        mes.lng = res.longitude
        this.sendMessage(mes);
        // console.log(res);
      },
      fail: (e) => {
        console.error(e)
        AUTH.checkAndAuthorize('scope.userLocation')
      }
    })
  },
  sendMessage(data) {
    for(let key in data){
      // console.log(key + '---' + data[key])
      if(data[key] == undefined) {
        return ;
      }
    }
    this.data.client.publish(Config.myTopic, JSON.stringify(data))
    // console.log(data)
  },
  onHide() {  //  切换后台调用
    // console.log('小程序切走了');

    this.data.client.publish(Config.myTopic, JSON.stringify({
      id: 4,
      name: '程帝',
      lat: 0,
      lng: 0
    }))
    clearInterval(this.data.myVar);
    setTimeout(() => {
      this.delConnect();
    }, 1000);
},
onShow() {
  // console.log('前台显示');
  if(wx.getStorageSync('me') && wx.getStorageSync('token')) {
    wx.getSetting({
      success: (res) => { //箭头函数为了处理this的指向问题	
        if (res.authSetting["scope.userLocation"]) {
          console.log("已授权");
          this.initSocket();
        }
      }
    })
} 
// else {
//   //  调用微信登录接口
//   console.log('没登录')
//   AUTH.wxGetCode();
// }
},

networkManage: function () {
  //监听网络状态
  wx.onNetworkStatusChange((res) => {
    console.log(res)
    if (!res.isConnected) {
      // that.msg('网络似乎不太顺畅');
      wx.showToast({
        title: '网络似乎不太顺畅',
        icon: 'none',
        duration: 3000
      })
    }
  })
}, 


updateManage: function () {
  var that = this;
  var updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    // console.log(res.hasUpdate)
    if (!res.hasUpdate) {
      // console.log('已是最新版本')
    } else {
      wx.showToast({
        title: '当前不是最新版本',
        icon: 'none'
      })
      wx.removeStorageSync('me')
      wx.removeStorageSync('token')
    }
  })
  // 监听新版本下载成功
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('me')
          wx.removeStorageSync('token')
          setTimeout(() => {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }, 1000);
        } else {
          that.updateManage();
        }
      }
    })
  })
  // 监听新版本下载失败
  updateManager.onUpdateFailed(function () {
    app.showModal({
      content: '新版本更新失败，是否重试？',
      confirmText: '重试',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    });
  })
},
  onLaunch: function () { // 当小程序加载完毕后就执行
    this.networkManage(); //调用监听网络状态的方法
    this.updateManage(); //调用检测小程序版本更新的方法
    if(wx.getStorageSync('me') && wx.getStorageSync('token')) {
      // this.initSocket();
      console.log('已登录');
      // wx.redirectTo({
      //     url: '/pages/index/index'
      // })
  } else {
    //  调用微信登录接口
    console.log('没登录')
    // AUTH.wxGetCode();
  }



  },

  
  globalData: {
    userInfo: null,
    ceshi: 2
  }
})