// index.js
const app = getApp()

Page({
  data: {
    showUploadTip: false,
  },

  onLoad: function(){
  },

  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  
});
