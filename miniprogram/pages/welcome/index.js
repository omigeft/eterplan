// index.js
const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    envList,
    selectedEnv: envList[0],
  },

  onLoad: function(options){
    if (!app.globalData.openId){
      this.getOpenId();
    }
  },
  
  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  onShow: function(){
    console.log('sss');
    wx.navigateTo({
      url: `/pages/library/index?envId=${this.data.selectedEnv.envId}`,
    });
    console.log('xxx');
  },

  getOpenId: function() {
    wx.showLoading({title: ''});
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      app.globalData.haveGetOpenId = true;
      app.globalData.openId = resp.result.openid;
      wx.hideLoading();
   }).catch((e) => {
      this.setData({showUploadTip: true});
      wx.hideLoading();
    });
  },

});
