const auth = require('../../utils/auth');
const Add = require('../../utils/myApi');


Page({
    data: {
        imgurl : '',
        userid: 0,
        xian : '1',
    },
    onLoad() {
        this.data.userid = (wx.getStorageSync('me')).id;
        if(wx.getStorageSync('tuijian') == '') {
          console.log(wx.getStorageSync('tuijian'));
          this.shengcheng();
          return ;
        }
        const imgurl = wx.getStorageSync('tuijian');
        // console.log(imgurl);
        this.setData({
            imgurl
        });
    },


    shengcheng() {
        console.log('开始生成推荐码');
        // console.log(this.data.userid);
        wx.showLoading({
          title: '正在生成推荐码',
        })
        Add.wxaQrcode({
          page: 'pages/my/index',
          scene: this.data.userid,
          expireHours: '1',
        }).then((res) => {
          // console.log(res);
          wx.setStorageSync('tuijian', res.data.data)
          this.setData({
              imgurl: res.data.data
          });
          wx.hideLoading();
        });
      }

});