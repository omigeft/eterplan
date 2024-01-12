// index.js
const app = getApp()

Page({
  data: {
    showUploadTip: false,
  },

  goToPunch: function(){
    wx.reLaunch({
      url: '/pages/punch/index',
    })
  },

  onLoad: function(){
  },
  
  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },

});
