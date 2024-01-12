// app.js

App({
  onLaunch: function () {

    this.globalData = {
        envId: 'cloud1-5g76riuyb0e7f357',
        haveGetOpenId: false,
        openId: '',
        cloudFunction: 'myCloudFunctions',
        userData: {},
        bookList: [],
        reviewList: [],
        updateChapterCatagory: false,
        updateDesk: false,
        updateMyBooks: false,
        // nightMode: false,
    };

    // let that = this
    // wx.getStorage({//读取本地夜间模式设置
    //     key: "nightMode",
    //     success (res) {
    //         that.globalData.nightMode = res.data;
    //     }
    // })

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: this.globalData.envId,
        traceUser: true,
      });
    }
    
    this.getOpenId();

  },
  
  getOpenId: function() {
    wx.showLoading({title: ''});
    wx.cloud.callFunction({
      name: this.globalData.cloudFunction,
      config: {
        env: this.globalData.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      this.globalData.haveGetOpenId = true;
      this.globalData.openId = resp.result.openid;
      if (this.callback){
          this.callback();
      }
      wx.hideLoading();
   }).catch((e) => {
       console.log(e);
      wx.hideLoading();
    });
  },

});
