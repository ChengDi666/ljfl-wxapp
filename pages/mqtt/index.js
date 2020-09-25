
var mqtt = require('../../utils/mqtt');
Page({
  data:{
    lianjie: '未连接',
    client: ''
  },
  onLoad() {
  },
  lianjie() {
    console.log('开始连接');
    let that = this;
    var url = 'wxs://iot.shlj.ltd:8084/mqtt';//替换自己的请求地址
    var client = mqtt.connect(url, {
      // clientId: "8084",
      username: 'test',
      password: 'test',
    });
    this.data.client = client;
    console.log(this.data.client);
    this.data.client.on('connect', () => {
      console.log("建立连接成功")
      that.setData({
        lianjie: '连接成功'
      })
      // this.data.client.publish('tttt', '我来啦')
    })


    this.data.client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
 
    this.data.client.on('error', (error) => {
      console.log('连接失败:', error)
      wx.showToast({
        title: '未连接',
        icon: 'none'
      })
      // this.data.client.on('connect',function(){
      //   console.log('连接成功');
      //   //订阅
      //   // client.subscribe('/test');
      // })
   
    })
  },
  sendMessage() {
    const datas = {
      id: this.data.id,
      lat: this.data.lat,
      lng: this.data.lng,
      name: this.data.name,
    }
    if(this.data.client && !this.data.client.disconnecting) {
      console.log(datas);
      console.log(JSON.stringify(datas));
      this.data.client.publish('tttt', JSON.stringify(datas), {}, (res) => {
        // console.log('消息已发');
        // console.log(res);
        wx.showToast({
          title: '消息已发送',
        })
        this.setData({
          infomes: ''
        })
      })
    } else {
      wx.showToast({
        title: '尚未连接',
        icon: 'none'
      })
    }
    // this.data.client.publish('tttt', '发个信息,测试下')
  },
  bindinputid(e){
    // console.log(e.detail.value);
    this.setData({ id: e.detail.value })
  },
  bindinputlat(e){
    // console.log(e.detail.value);
    this.setData({ lat: e.detail.value })
  },
  bindinputlng(e){
    // console.log(e.detail.value);
    this.setData({ lng: e.detail.value })
  },
  bindinputname(e){
    // console.log(e.detail.value);
    this.setData({ name: e.detail.value })
  },
  delConnect() {
    if(!this.data.client) return ;
    console.log('要断开连接')
    let that = this;
    // this.data.client.publish('tttt', '我走啦')
    this.data.client.end(true, {reasonCode: 123456});
    if(this.data.client.disconnecting) {
      this.setData({
        lianjie: '连接断开'
      })
      console.log('断开了连接')
    }
  },

    // takePhoto() {
    //   const ctx = wx.createCameraContext()
    //   ctx.takePhoto({
    //     quality: 'high',
    //     success: (res) => {
    //         // console.log(res);
    //       this.setData({
    //         src: res.tempImagePath
    //       })
    //     }
    //   })
    // },
    // error(e) {
    //   console.log(e.detail)
    // },
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
        console.log(client)
        
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
  })