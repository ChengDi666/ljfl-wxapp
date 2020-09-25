const auth = require('../../utils/auth');
const Add = require('../../utils/myApi');
Page({
    data: {
        username: '',
        password: '',
    },
    onLoad() {
        if (wx.getStorageSync('me')) {
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }
        setTimeout(() => {
            if(!wx.getStorageSync('token')) {
                // console.log('没有 token 值');
                auth.wxGetCode();
            }
        }, 300);
    },
    async bindGetPhoneNumber(res) {
        if(!wx.getStorageSync('token')) {
            // console.log('没有 token 值');
            await auth.wxGetCode();
            setTimeout(() => {
                // console.log('再次执行');
                this.bindGetPhoneNumber(res);
            }, 500);
            return ;
        }
        console.log(res)
        if(res.detail.errMsg == 'getPhoneNumber:fail user deny') {

        }
        // console.log(res.detail.errMsg)
        // console.log(res.detail.iv)
        // console.log(res.detail.encryptedData)
        const message =  {
            encryptedData: res.detail.encryptedData,
            iv: res.detail.iv,
            session_key: wx.getStorageSync('token')
        };
        // console.log(message);
        await Add.wxLogin(message).then(ress => {
            console.log(ress)
            if(ress.statusCode == 200) {
                wx.showToast({
                  title: '登录成功',
                })
            let user = ress.data;
            Add.addresses(user.address_id).then((res) => {
                console.log(res);
                user.address = res.data.data[0];
                wx.setStorageSync('me', user);
                wx.redirectTo({
                    url: '/pages/index/index'
                })
            });
            } else {
                wx.showToast({
                    title: `登录失败，请稍后重试 - ${ress.statusCode} `,
                    icon: 'none'
                  })
            }
        })    
    },

    async login() {
        const datas = {
            username: this.data.username,
            password: this.data.password
        };
        if (this.data.username == '' || this.data.password == '') {
            wx.showToast({
                title: '用户名/密码不能为空!',
                icon: 'none'
            });
            return;
        }
        // console.log(datas);
        const isLogin = await auth.gologin(datas);
        if (isLogin) {
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }
        console.log(isLogin);
    },
    nameCheng(e) {
        // console.log(e.detail.value);
        this.setData({
            username: e.detail.value
        });
    },
    passCheng(e) {
        // console.log(e.detail.value);
        this.setData({
            password: e.detail.value
        });
    }
});
