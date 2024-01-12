// index.js
const app = getApp()

Page({
  data: {
    showUploadTip: false,
    haveGetChapterList: false,
    bookName: '',
    bookTitle: '',
    bookIntroduction: '',
    bookReadingList: {},
    chapterList: [],
    haveThisBook: false,
    readingThisBook: false,
    readingStatus: [],
    bookMemoryRate: 0,
    learning: false,
  },

  getChapters: function (){
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'chapterCatagory',
            name: this.data.bookName,
        },
    }).then((resp) => {
        if (this.data.learning){
            resp.result.data = resp.result.data.filter((i) => {
                let thisChapterStatus = this.data.readingStatus.find((j) => {
                    return j.name == i.name;
                })
                if (!thisChapterStatus) return true;
                if (thisChapterStatus.discard == true) return false;
                if (thisChapterStatus.reviewTime.length == 0) return true;
                else return false;
            });
        }
        this.setData({
            haveGetChapterList: true,
            chapterList: resp.result.data,
        });
        wx.hideLoading();
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  onClickChapterInfo: function(e){//点击章节
    const index = e.currentTarget.dataset.index;
    var status;
    if (this.data.learning){
        if (this.data.readingStatus.find((item) => {
            return item.name == this.data.chapterList[index].name;
        })) status = 2;
        else status = 1;
    }
    else if (this.data.haveThisBook){
        if (this.data.readingThisBook){
            if (this.data.readingStatus.find((item) => {
                return item.name == this.data.chapterList[index].name;
            })) status = 2;
            else status = 1;
        }else status = 0;
    }else status = 0;
    wx.navigateTo({
        url: `/pages/readChapter/index?bookName=${this.data.bookName}&chapterName=${this.data.chapterList[index].name}&status=${status}`,
    });
  },

  getBook: function(){
    if (this.data.haveThisBook) return ;
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'getBook',
            _openId: app.globalData.openId,
            name: this.data.bookName,
        },
    }).then((resp) => {
        app.globalData.userData = resp.result.data[0];
        app.globalData.updateMyBooks = true;
        this.getMyBookInfo();
        wx.hideLoading();
        wx.showToast({
            title: '获取成功',
            duration: 2000,
        });
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  addBook: function(){
    if (!this.data.haveThisBook||this.data.readingThisBook) return ;
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'addBook',
            _openId: app.globalData.openId,
            name: this.data.bookName,
        },
    }).then((resp) => {
        app.globalData.userData = resp.result.data[0];
        this.getMyBookInfo();
        wx.hideLoading();
        wx.showToast({
            title: '添加成功',
            duration: 2000,
        });
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  removeBook: function(){
    if (!this.data.haveThisBook||!this.data.readingThisBook) return ;
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'removeBook',
            _openId: app.globalData.openId,
            name: this.data.bookName,
        },
    }).then((resp) => {
        app.globalData.userData = resp.result.data[0];
        this.getMyBookInfo();
        wx.hideLoading();
        wx.showToast({
            title: '移出成功',
            duration: 2000,
        });
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  getMyBookInfo: function(){
    let myBookInfo = app.globalData.userData.book.find((item) => {//获取用户数据中本书状态
        return item.set == this.data.bookName;
    });
    if (myBookInfo){
        this.setData({
            haveThisBook: true,
            readingThisBook: myBookInfo.reading,
            readingStatus: myBookInfo.status,
        });
    }else this.setData({haveThisBook: false});
  },

  onLoad: function (options) {
    this.setData({
        bookName: options.name,
        bookTitle: options.title,
        bookIntroduction: options.introduction,
        learning: Boolean(Number(options.learning)),
    });
    // if (learning){
    //     for (let i=0; i<=app.globalData.readingList.length; i++){
    //         if (app.globalData.readingList[i].set == this.data.bookName){
    //             this.setData({
    //                 bookReadingList: app.globalData.readingList[i]
    //             });
    //             break;
    //         }
    //     }
    // }
    this.getMyBookInfo();
    this.getChapters();
    console.log(this.data.chapterList);
    app.globalData.updateChapterCatagory = false;
  },

  onShow: function(){
      if (this.data.learning && app.globalData.updateChapterCatagory){
        this.getMyBookInfo();
        this.getChapters();
      }
  },

  onPullDownRefresh:function(){
    this.onLoad({
        name: this.data.bookName,
        title: this.data.bookTitle,
        introduction: this.data.bookIntroduction,
        learning: this.data.learning,
    });
    wx.stopPullDownRefresh();
  },

});
