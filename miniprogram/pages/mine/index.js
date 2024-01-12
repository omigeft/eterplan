// index.js
// const app = getApp()

Page({
  data: {
    showUploadTip: false,
    optionList: [{
      name: 'myBooks',
      title: '我的书籍',
      page: 'myBooks',
    },{
        name: 'punch',
        title: '我的打卡',
        page: 'punch',
    },{
      name: 'settings',
      title: '设置',
      page: 'settings',
    },{
      name: 'helps',
      title: '帮助',
      page: 'helps',
    }]
  },

  getMyInfo: function(e){
    wx.showLoading({title: 'Loading'});
    let info=e.detail.userInfo;
    console.log(info);
    this.setData({
      isLogin: true,
      src: info.avatarUrl,
      nickName: info.nickName
    })
    wx.hideLoading();
  },

  onClickOption: function(e){
    if (e.currentTarget.dataset.index==0){
        wx.navigateTo({
            url: `/pages/${this.data.optionList[0].page}/index?learning=${0}`,
        });
    }else{
        wx.navigateTo({
            url: `/pages/${this.data.optionList[e.currentTarget.dataset.index].page}/index`,
        });
    }
  },

  onLoad: function(){
  },

  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },

});
