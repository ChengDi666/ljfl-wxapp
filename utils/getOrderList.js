
const Add = require('./myApi');
const ConfigUrl = require('../config');

let adminToken;
let MSdata;
var orderList = [];
 var urls = 'https://user.api.it120.cc';
  // data = {
  //     merchantNo: '2003280141290150',
  //     merchantKey: '7de4187a88acf81332eff4d3eb66ce4d',
  // };
  //  绿分
  // data = {
  //   merchantNo: '2005060925355435',
  //   merchantKey: '00dfbdb296ec754d2899102eac0434a6',
  // };
  //  合肥
  // data = {
  //   merchantNo: '2006131424420936',
  //   merchantKey: '5f036a02f929bfac3fd5a2af0ed4a306',
  // },

  function initMS() {
    if(ConfigUrl.urlname) {
      switch (ConfigUrl.urlname) {
        case 'yantai':
         MSdata = {
                merchantNo: '2005060925355435',
                merchantKey: '00dfbdb296ec754d2899102eac0434a6',
              }
          break;
        case 'hefei':
          MSdata = {
              merchantNo: '2006131424420936',
              merchantKey: '5f036a02f929bfac3fd5a2af0ed4a306',
              }
          break;
      
        default:
          break;
      }
    }
  }


  async function initWX() {

    //  使用商户号和密匙获得Token
    //  烟台
    const datas = MSdata;
    const url = `${urls}/login/key`
    await Add.getFormData(url, datas).then(async (res) => {
      console.log(res.data);
      adminToken = res.data.data;
    });
    // console.log(adminToken)
  }


  async function syncShopping(userMessages) {
    initMS();
    orderList = [];
    if (!adminToken) { await initWX(); }


    const shopArr = await shopType();
    console.log(shopArr);

    
    //  获得大件垃圾订单
    const mydata = {
      goodsId: shopArr[0].id,
      page: '1',
      pageSize: '50'
    };
    await ce(`${urls}/user/apiExtOrder/list`, adminToken, mydata)   
      .then((res) => {
        console.log(res);
        // console.log(res.data.data.result);
        if (res.data.code == 0) {
          res.data.data.result.map((item) => {
            order(item.id);
          });
        }
      });


    return orderList;
  }

  async function  order(id) {
    //  订单详情
    await she(`${urls}/user/apiExtOrder/detail?id=${id}`, adminToken).then((res) => {
      console.log(res);
      console.log(res.data.data.extJson);
      const userID = wx.getStorageSync('me').id;
      // console.log(userID);
      // console.log(res.data.apiExtOrderLogistics);
      if (res.data.data.extJson && userID <= res.data.data.extJson.myAddressId) {
        // console.log(res);
        // console.log(res.data.order.dateAdd);
        res.data.data.goodsList[0].property = res.data.data.goodsList[0].property.split(',');
        orderList.push(res.data.data);
      } else {
        res.data.data.goodsList[0].property = res.data.data.goodsList[0].property.split(',');
        orderList.push(res.data.data);
      }
    })

  }


  async function shopType() {
    //  商品分类
    // console.log(adminToken)
    const shopArr = await ce(`${urls}/user/apiExtShopGoodsCategory/list`, adminToken, {}).then((res) => {
      // console.log(res.data);
      const shoplist = res.data.data.map((item) => {
        if (item.name === '预约回收') {
          // console.log(item);
          return ce(`${urls}/user/apiExtShopGoods/list`, adminToken, {categoryIdSel: item.id}).then((ress) => {
            // console.log(ress.data);
            return ress.data.data.result
          });
        }
        return ;
      }).filter(item => item);
      // console.log(shoplist);
      return shoplist[0];
    });
    console.log(shopArr);
    return shopArr;
  }


  function she(urls, adminTokens) {
    return new Promise((resolve, reject) => {
      wx.request({
          url: urls,
          method: 'GET',
          header: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-Token': adminTokens
          },
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


  function ce(urls, adminTokens, datas) {
    return new Promise((resolve, reject) => {
      wx.request({
          url: urls,
          method: 'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-Token': adminTokens
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

  module.exports = {
    syncShopping
};
