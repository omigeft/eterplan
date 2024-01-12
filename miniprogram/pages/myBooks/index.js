// index.js
const app = getApp()

Page({
  data: {
    showUploadTip: false,
    haveGetBookList: false,
    showNotReading: true,
    bookList: [],
    learning: false,
  },

  onClickBooksInfo: function(e){
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
        url: `/pages/chapterCatagory/index?name=${this.data.bookList[index].name}&title=${this.data.bookList[index].title}&introduction=${this.data.bookList[index].introduction}&learning=${Number(this.data.learning)}`,
    });
  },

  onLoad: function (options) {
    this.setData({learning: Boolean(Number(options.learning))});
    this.setData({
        bookList: app.globalData.bookList.filter((i) => {
            for (let j=0; j<app.globalData.userData.book.length; j++){
                if (i.name == app.globalData.userData.book[j].set) return true;
            }
            return false;
        }),
    });
    app.globalData.updateMyBooks = false;
  },

  onShow: function(){
    if (app.globalData.updateMyBooks) this.onLoad({
        learning: this.data.learning
    });
  },

  onPullDownRefresh:function(){
    this.onLoad({
        learning: this.data.learning,
    });
    wx.stopPullDownRefresh();
  },

});
