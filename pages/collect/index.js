const auth = require('../../utils/auth');
const Add = require('../../utils/myApi');
Page({
    data: {

        value3: 0,
        mobile: '',
        isLocalhost: false,
        jlbz: [],
        ljxlArr: [],
        jlbzName: '',
        drop: {
            customer_id: 0,
            device_id: 0,
            user_id: 0,
            ljlx_value: '',
            amount: '',
        },
        sbmc: [],
        addresses: [],
        isok: false,
    },
    async onLoad() {
        this.data.drop.user_id = (wx.getStorageSync('me')).id;
        await Add.getJlbz('jlbz').then((res) => {   //  计量标准
            // console.log(res);
            this.setData({
                jlbz: res.data.data
            });
        }).catch((err) => {
            this.showToast(err.error.message);
            return;
        });

        await Add.getlaji().then((res) => {   //  垃圾类型
            // console.log(res);
            this.setData({
                ljxlArr: res.data.data
            });

            if (this.data.isLocalhost) {
                res.data.data.forEach((item) => {
                    if (item.value === this.drop.ljlx_value) {
                        this.showJL(item.jlbz_value);
                    }
                });
                return;
            }
            this.data.drop.ljlx_value = res.data.data[0].value;
            // let items = res.data.data;
            this.data.ljxlArr[0].checked = true;
            this.setData({
                ljxlArr: this.data.ljxlArr
            });
            // console.log(this.data.ljxlArr)
            this.showJL(res.data.data[0].jlbz_value);
        }).catch((err) => {
            this.showToast(err.error.message);
            return;
        });


        const addressPosition = '';
        await Add.getDevices(addressPosition).then((res) => {   //  设备信息
            // console.log(res);
            this.setData({
                sbmc: res.data.data
            })
            // console.log(this.data.sbmc);
            // if (res.data.length === 0) {
            //   this.showToast('没有设备信息');
            //   return ;
            // }
            // if (this.isLocalhost) { return; }
            this.data.drop.device_id = res.data.data[0].id;
        }).catch((err) => {
            // this.showToast(err.error.message);
            return;
        });





    },

    showJL(id) {
        // console.log(id);
        this.data.jlbz.forEach((item) => {
            if (item.value === id) {

                // console.log(item);
                this.setData({
                    jlbzName: item.name
                });
                // console.log(this.jlbzName);
            }
        });
    },

    bindPickerChange: function (e) {
        // console.log(e.detail.value)
        this.data.drop.device_id = this.data.sbmc[e.detail.value].id;
        // console.log(this.data.sbmc[e.detail.value])
        this.setData({
            value3: e.detail.value
        })
    },


    amountCheng(e) {
        // console.log(e.detail.value)
        const value = e.detail.value;
        this.data.drop.amount = parseFloat(value).toFixed(2);
        // console.log(parseFloat(value).toFixed(2));
    },
    phoneCheng(e) {
        // console.log(e)
        // console.log(e.detail.value)
        let dianhua;
        if (e) {
            dianhua = e.detail.value
        } else {
            dianhua = this.data.mobile;
        }
        // console.log(dianhua);
        // console.log(dianhua[0]);
        if (dianhua[0] != 1 && dianhua.length != 9) {   //  不是 1 开头，且位数不等于 9 的
            // console.log('卡号');
            this.setData({
                hided: false
            })
            return;
        }
        if (dianhua[0] == 1 && dianhua.length != 11) {   //  1 开头，且位数不等于 11 的
            // console.log('手机号');
            this.setData({
                hided: false
            })
            return;
        }
        
        // console.log('过来了');
        // if (dianhua.length != 9 && dianhua.length != 11) {
        //     this.data.hided = false;
        //     return;
        // }
        this.setData({
            addresses: []
        });
        Add.getaddress(dianhua).then((res) => {
            // console.log(res);
            if (!res.data.data || res.data.data.length == 0 || res.data.data.length > 1) {
                wx.showToast({
                  title: '手机号码错误或未绑定！',
                  icon: 'none'
                })
                return;
            }
            if (res.data.data.cardno === undefined || res.data.data.cardno === null) {
                wx.showToast({
                  title: '地址未绑定！',
                  icon: 'none'
                })
                return;
            }
            this.data.drop.customer_id = res.data.data.id;
            this.data.addresses.push(res.data.data.address);
            // // console.log(this.addresses);
            this.setData({
                hided: true,
                addresses: this.data.addresses
            });
        }).catch((err) => {
            this.hided = false;
            if (err.error === 'no found') {
                this.showToast('手机号码错误或未绑定！');
            }
            // console.log('oops', err);
        });
    },

    radioChange(e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value);
        this.data.drop.ljlx_value = e.detail.value;
        const items = this.data.ljxlArr
        for (let i = 0, len = items.length; i < len; ++i) {
            if (items[i].value == e.detail.value) {
                this.showJL(items[i].jlbz_value);
            }
            items[i].checked = items[i].value === e.detail.value
        }

        this.setData({
            ljxlArr: items
        })
        // console.log(this.data.ljxlArr)
        // console.log(this.data.drop)
    },
    saomiao() {
        console.log('使用扫一扫')
        var _this = this;
        // 允许从相机和相册扫码
        wx.scanCode({
            success: (res) => {
                // console.log(res);
                _this.data.drop.customer_id = '';
                var result = res.result;
                //  去除加密
                // var result = '';
                // for (let i = 0; i < res.result.length; i++) {
                //     if (i%2 != 1) {
                //         // console.log(res.result[i]);
                //         result += res.result[i];
                //     } 
                // }
                _this.setData({
                    mobile: result,
                    addresses: []
                })
                _this.phoneCheng();
            }
        })

    },

    collect() {
        console.log(this.data.drop);
        this.setData({
            isok: true
        });
        for (const key of Object.keys(this.data.drop)) { 
        //   console.log(key + ':' + this.data.drop[key]);
          if (!this.data.drop[key] || this.data.drop[key] === '') {
            // this.showToast('请检查数据，无法上传');
            wx.showToast({
              title: '请检查数据，无法上传',
              icon: 'none'
            })       
            this.setData({
                isok: false
            });
            // console.log('请检查数据，无法上传');
            return;
          }
        }
        Add.devicesUpload(this.data.drop).then((res) => {
            wx.showToast({
              title: '上传成功',
            })
            console.log(res);
        //   this.showToast('上传成功');
        //   localStorage.setItem('listType', JSON.stringify({
        //     ljlx_value: this.drop.ljlx_value,
        //     device_id: this.drop.device_id,
        //     mobile: this.mobile
        //   }));
          this.data.drop.amount = '';
          this.setData({
            drop: this.data.drop,
            isok: false
          })
          // this.mobile = '';
          // this.drop.customer_id = '';
        }).catch((err) => {
            wx.showToast({
            title: '网络错误，无法上传!',
            icon: 'none'
            })
            return;
        });
      }


});