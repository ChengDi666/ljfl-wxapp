const Add = require('./myApi');
const app = getApp();

function gologin(data) {
    // console.log(data);
    return Add.login(data).then(async (res) => {
        // console.log(res);
        if(res.statusCode == 401) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            return false;
        }
        if(res.statusCode == 404) {
            wx.showToast({
              title: '404',
              icon: 'none'
            });
            return false;
        }
        if (res.statusCode == 200) {
            wx.setStorageSync('access_token', res.data.token);
            await ce(res.data.user);
            return true;
        }
        wx.showToast({
            title: '请重试',
            icon: 'none'
          });
        return false;
    }, function(error) {
        console.log(error);
        wx.showToast({
            title: error,
            icon: 'none'
          });
        return false;
      });
}
function ce(user) {
    // console.log(user)
    Add.addresses(user.address_id).then((res) => {
        // console.log(res);
        user.address = res.data.data[0];
        wx.setStorageSync('me', user);
    });
}


async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}


async function wxGetCode() {
  wx.login({
      success: function (res) {
          var code = res.code;
          if (code) {
            // console.log('获取用户登录凭证：' + code);
            Add.getCode(res.code).then(ress => {
              // console.log(ress)
              wx.setStorageSync('token', ress.data.session_key)
            })
          } else {
            // console.log('获取用户登录态失败：' + res.errMsg);     
            wx.showToast({
              title: '获取用户登录态失败：' + res.errMsg,
              icon: 'none'
            })
          }
      },
      fail() {
          wx.showToast({
              title: '获取code失败',
              icon: 'none'
          })
      }
  })
}
async function bindGetPhoneNumber(res) {
  if(!wx.getStorageSync('token')) {
      // console.log('没有 token 值');
      await wxGetCode();
      setTimeout(() => {
          // console.log('再次执行');
          this.bindGetPhoneNumber(res);
      }, 500);
      return ;
  }
  // console.log(res)
  if(res.detail.errMsg == 'getPhoneNumber:fail user deny') {
    wx.showToast({
      title: '取消了登录',
      icon: 'none'
    })
    return ;
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
      // console.log(ress)
      if(ress.statusCode == 200) {
          wx.showToast({
            title: '登录成功',
          })
          // setTimeout(() => {
          //   const asse = getApp();
          //   console.log(asse.initSocket());
          // }, 3000);
      let user = ress.data;
      Add.addresses(user.address_id).then((res) => {
          // console.log(res);
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
}




module.exports = {
    gologin: gologin,
    ce: ce,
    wxGetCode,
    checkAndAuthorize,
    bindGetPhoneNumber
};
