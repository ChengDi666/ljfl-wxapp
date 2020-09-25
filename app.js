//app.js
var mqtt = require('./utils/mqtt');
var AUTH = require('./utils/auth');
App({
  initSocket: function() {
    //小程序中只能用wxs://开头
      var url = 'wxs://iot.shlj.ltd:8084/mqtt';//替换自己的请求地址
      // console.log('wss://iot.shlj.ltd:8084/mqtt');
   
      var client = mqtt.connect(url, {
        // clientId: "8084",
        username: 'test',
        password: 'test',
      });
      console.log('lihdhhf')
      
         //建立连接
    client.on('connect', function () {
      console.log("建立连接")
      //发布主题presence,消息内容为Hello mqtt
      client.publish('tttt', '发个信息')


      // //订阅主题 presence
      // client.subscribe('presence', function (err) {
      //   if (!err) {
      //     console.log("subscribe success!")
      //     //发布主题presence,消息内容为Hello mqtt
      //     client.publish('presence', 'Hello mqtt')
      //   }else{
      //   //打印错误
      //     console.log(err)
      //   }
      // })
    })


    client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
 
    client.on('error', (error) => {
      console.log('连接失败:', error)

      client.on('connect',function(){
        console.log('连接成功');
        //订阅
        // client.subscribe('/test');
      })
      
      // client.on('message', function(topic, payload) {
      //   console.log("rev:" + [topic, payload].join(": "))
      // })
    })
  },

  onLaunch: function () {
    this.initSocket();
    if(wx.getStorageSync('me') && wx.getStorageSync('token')) {
      console.log('已登录');
      wx.redirectTo({
          url: '/pages/index/index'
      })
  } else {
    //  调用微信登录接口
    AUTH.wxGetCode();
  }

  

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  
  globalData: {
    userInfo: null
  }
})