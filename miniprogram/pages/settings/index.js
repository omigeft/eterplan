// index.js
const app = getApp()

Page({
  data: {
    showUploadTip: false,
    selectMemoryRate: [{index:0,key:'90%:疯狂复习模式',value:0.9},{index:1,key:'80%:复习使我快乐',value:0.8},{index:2,key:'70%:我想复习更多',value:0.7},{index:3,key:'60%:标准复习方案',value:0.6},{index:4,key:'50%:我想复习少一点',value:0.5},{index:5,key:'40%:我对自己的记忆力非常自信',value:0.4},{index:6,key:'30%:小程序外自己有复习了',value:0.3},{index:7,key:'20%:我过目不忘',value:0.2},{index:8,key:'10%:最强大脑节目台上见',value:0.1},{index:9,key:'0%:压根不想复习',value:0}],
    selectMemoryRateIndex: 3,
    // nightMode: false,
  },

  memoryRateChange: function(e){
    var selectObject = this.data.selectMemoryRate[Number(e.detail.value)];
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'memoryRateChange',
            _openId: app.globalData.openId,
            value: selectObject.value,
        },
    }).then((resp) => {
        console.log(resp);
        this.setData({selectMemoryRateIndex: selectObject.index});
        app.globalData.userData.ratedMemoryRate = selectObject.value;
        app.globalData.updateDesk = true;
        wx.hideLoading();
        wx.showToast({
            title: '修改成功',
            duration: 2000,
        });
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

//   changeNightMode: function(){
//       this.data.nightMode = !this.data.nightMode;
//       wx.setStorage({
//           key: 'nightMode',
//           data: this.data.nightMode,
//       });
//       app.globalData.nightMode = this.data.nightMode;
//   },

  onLoad: function(){
    this.setData({
        selectMemoryRateIndex: this.data.selectMemoryRate.findIndex((item) => {
            return item.value == app.globalData.userData.ratedMemoryRate;
        })
    });
    // let that = this;
    // wx.getStorage({
    //     key: 'nightMode',
    //     success (res) {
    //         that.setData({
    //             nightMode: res.data
    //         })
    //     }
    // });
  },
  
  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },

});
