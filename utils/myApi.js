const urls = require('../config');

function logins(data) {
  //  登录
  const params = {
      username: data.username,
      password: data.password,
  };
  return new Promise((resolve, reject) => {
      wx.request({
          // url: `https://admin.jssrxx.com/hefei/login`,
          url: `${urls.myLink}/api/login`,
          method: 'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          data: params,
          success: function (res) {
              // console.log(res);
              resolve(res);
          },
          fail: function (err) {
              // console.log(err);
              reject(err.errMsg);
          }
      });
  });
}

function Addresses(id) {
  //  根据地址id获取信息
  return new Promise((resolve, reject) => {
    wx.request({
        url: `${urls.myLink}/api/addresses?id=${id}`,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res);
            return resolve(res)
        }
    });
  });
}


function getlaji() {
  //  获取垃圾分类
  return new Promise((resolve, reject) => {
    wx.request({
        url: `${urls.myLink}/api/garbages`,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res);
            return resolve(res)
        }
    });
  });
}

function getJlbz(type) {
  //  获取计量标准
  return new Promise((resolve, reject) => {
    wx.request({
        url: `${urls.myLink}/api/dicts?type=${type}`,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res);
            return resolve(res)
        }
    });
  });
}

function getDevices(data) {
  //  获取设备
  return new Promise((resolve, reject) => {
    wx.request({
        url: `${urls.myLink}/api/devices?position=${data}`,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res);
            return resolve(res)
        }
    });
  });
}

function devicesUpload(drop) {
  //  提交督导信息
  return new Promise((resolve, reject) => {
    wx.request({
        url: `${urls.myLink}/api/drops`,
        data:  drop,
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res);
            return resolve(res)
        },
        fail: function (err) {
            // console.log(err);
            reject(err.errMsg);
        }
    });
  });
}

function getaddress(mobile) {
  //  通过手机号获取地址信息
  return new Promise((resolve, reject) => {
    wx.request({
        url: `${urls.myLink}/api/customers?search=${mobile}`,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res);
            return resolve(res)
        }
    });
  });
}




function wxaQrcode(datas) {
  //  获取小程序码
  return new Promise((resolve, reject) => {
    wx.request({
        url: 'https://api.it120.cc/yantai/qrcode/wxa/unlimit',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: datas,
        success: function (res) {
            // console.log(res);
            resolve(res);
        },
        fail: function (err) {
            // console.log(err);
            reject(err.errMsg);
        }
    });
  });
}


function getFormData(urls,datas) {
  //  通用 POST 请求
  return new Promise((resolve, reject) => {
    wx.request({
        url: urls,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: datas,
        success: function (res) {
            // console.log(res);
            resolve(res);
        },
        fail: function (err) {
            // console.log(err);
            reject(err.errMsg);
        }
    });
  });
}





function Address(id) {
  //  当前地址的下级地址
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/addresses/${id}/children`,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        return resolve(res)
      }
    })
  });
}


function AddressRange(lat, lng) {
  //  获取区域内的地址信息
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/addresses/position?position={"lat": "${lat}", "lng": "${lng}"}`,
      // url: `${urls.myLink}/addresses/position?position={"lat": "${lat}", "lng": "${lng}"}`,
      // data: {
      //   position: {lat:lat,lng:lng}
      // },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res);
        return resolve(res);
      },
      fail (err) {
        return resolve(err);
      }
    })
  });
}

function getUserMessage(userData) {
  //  客户注册
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/customers`,
      data: {
        nickname: userData.nickname,
        realname: userData.nickname,
        phonenumber: userData.phonenumber,
        address_id: userData.address_id,
        unionid: userData.unionid,
        user_id: userData.user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        return resolve(res)
      }
    })
  });
}


function getCode(code) {
  //  通过手机获取地址信息
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/wx/getcode?code=${code}`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res)
        return resolve(res)
      }
    })
  });
}

function wxLogin(data) {
  //  通过手机获取地址信息
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/wx/login`,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res)
        return resolve(res)
      }
    })
  });
}


function getAddressName(id) {
  //  通过 id 拆分地址
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/addresses/${id}/details`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res)
        return resolve(res.data)
      }
    })
  });
}



function amendCustomersAddress(userData) {
  //  客户修改地址
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.myLink}/api/customers/${userData.id}`,
      data: {
        // addresses: userData.address,
        address_id: userData.address.data.id
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        return resolve(res)
      }
    })
  });
}


module.exports = {
  address: Address,
  AddressRange: AddressRange,
  getUserMessage: getUserMessage,
  // getAddress: getAddress,
  getAddressName: getAddressName,
  amendCustomersAddress: amendCustomersAddress,
  login: logins,
  addresses: Addresses,
  getlaji: getlaji,
  getJlbz: getJlbz,
  getDevices: getDevices,
  devicesUpload: devicesUpload,
  getaddress: getaddress,
  wxaQrcode,
  getFormData,
  getCode,
  wxLogin
}
