const auth = require('../../utils/auth');
const Add = require('../../utils/myApi');
const orders = require('../../utils/getOrderList');
Page({
    data: {
        orderList: [],
        isPaxu: true,
        isShow: false,
        orders: {},
    },
    async onLoad() {
        wx.showLoading({
          title: '正在加载订单中'
        })
        await orders.syncShopping().then((res) => {
            console.log(res);
            this.data.orderList = res;
        });
        setTimeout(() => {
            this.orderSorting(this.data.orderList);
        }, 300);
    },
    close: function() {
        this.setData({
            isShow: false
        });
    },
    open1(message) {
        console.log(message);
        const datas = message.currentTarget.dataset['item'];
        console.log(datas);

        //  时间段
        const items = datas.goodsList[0].property[0]
        const name = items.split(':')[0];
        const time = (items.split(':')).length > 3 ? items.substr(4) : items.split(':')[1]
        console.log({ name, time })
        
        this.setData({
            orders: datas,
            propertys: { name, time }
        })
        if(datas.userBean.mobile == undefined) {
            datas.userBean.mobile == '用户号码未绑定'
            this.setData({
                address: ''
            });
        } else {
            Add.getaddress(datas.userBean.mobile).then((res) => {
                console.log(res.data);
                this.setData({
                    address: res.data.data.parentname + ' ' + res.data.data.name
                });
            })
        }
        this.setData({
            isShow: true
        });
    },

    orderSorting(arr) {
        //  按时间排序
        // console.log(this.orderList);
        // console.log(arr);
        this.data.isPaxu = !this.data.isPaxu;
        if (arr === undefined) {
          return ;
        }
        // console.log(this.data.isPaxu);
        const sortArr = arr.sort((a, b) => {
          if (this.data.isPaxu) {
            return new Date(a.order.dateAdd).valueOf() - new Date(b.order.dateAdd).valueOf();
          } else {
            return new Date(b.order.dateAdd).valueOf() - new Date(a.order.dateAdd).valueOf();
          }
        });
        // console.log(sortArr);
        // this.data.orderList = sortArr;
        this.setData({
            orderList: sortArr
        })
        wx.hideLoading();
        // new Date(a.createTime).valueOf() - new Date(b.createTime).valueOf()
      },


});