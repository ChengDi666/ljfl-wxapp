const Add = require('./myApi');

function gologin(data) {
    // console.log(data);
    return Add.login(data).then(async (res) => {
        console.log(res);
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
        console.log(res);
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
module.exports = {
    gologin: gologin,
    ce: ce,
    wxGetCode,
    checkAndAuthorize
};
