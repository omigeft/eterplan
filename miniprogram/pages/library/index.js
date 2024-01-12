// index.js
const app = getApp()

Page({
  data: {
    showUploadTip: false,
    haveGetBookList: false,
    bookList: [],
  },

  onClickBooksInfo: function(e){
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
        url: `/pages/chapterCatagory/index?name=${this.data.bookList[index].name}&title=${this.data.bookList[index].title}&introduction=${this.data.bookList[index].introduction}&learning=${0}`,
    });
  },

  onLoad: function () {
      this.setData({
          haveGetBookList: true,
          bookList: app.globalData.bookList
      })
  },

  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  
});
