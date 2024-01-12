// pages/readPassage.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showUploadTip: false,
        haveGetPassage: false,
        bookName: '',
        chapterName: '',
        chapterTitle: '',
        centerAlign: false,
        passage: [],
        status: 0,//0:未拥有该书籍或不在计划内或丢弃了该章节 1:未学过这个章节 2:仅仅正在浏览这个章节 3:正在复习这个章节
    },

    finishReview: function(){
        wx.redirectTo({
          url: `/pages/finish/index`,
        });
    },

    goToNextChapter: function(){
        var reviewListIndex = app.globalData.reviewList.length-1;
        var chapterListIndex = app.globalData.reviewList[reviewListIndex].chapterList.length-1;
        app.globalData.reviewList[reviewListIndex].chapterList.splice(chapterListIndex,1);//从复习计划中删除该章节
        chapterListIndex = app.globalData.reviewList[reviewListIndex].chapterList.length-1;
        if (chapterListIndex == -1){//若复习计划中本书没有章节了，则从计划中删去本书
            app.globalData.reviewList.splice(reviewListIndex,1);
            reviewListIndex = app.globalData.reviewList.length-1;
            if (reviewListIndex == -1){//若复习计划中没有书了，则复习完成
                this.finishReview();
                return ;
            }else{
                chapterListIndex = app.globalData.reviewList[reviewListIndex].chapterList.length-1;//换书了，重新计算章节索引
            }
        }
        var tempBookName = app.globalData.reviewList[reviewListIndex].set;
        var tempChapterName = app.globalData.reviewList[reviewListIndex].chapterList[chapterListIndex];
        wx.redirectTo({
          url: `/pages/readChapter/index?bookName=${tempBookName}&chapterName=${tempChapterName}&status=${3}`,
        });
    },

    learnChapter: function(){
        wx.showLoading({title: 'Loading'});
        wx.cloud.callFunction({
            name: app.globalData.cloudFunction,
            config: {env: app.globalData.envId},
            data: {
                type: 'learnChapter',
                _openId: app.globalData.openId,
                bookName: this.data.bookName,
                chapterName: this.data.chapterName,
            },
        }).then((resp) => {
            app.globalData.userData = resp.result.data[0];
            app.globalData.updateChapterCatagory = true;
            app.globalData.updateDesk = true;
            this.setData({status: 2});
            wx.hideLoading();
            wx.showToast({
                title: '已掌握！',
                duration: 2000,
            });
        }).catch((e) => {
            console.log(e);
            this.setData({showUploadTip: true});
            wx.hideLoading();
        });
    },

    forgetChapter: function(){
        wx.showLoading({title: 'Loading'});
        wx.cloud.callFunction({
            name: app.globalData.cloudFunction,
            config: {env: app.globalData.envId},
            data: {
                type: 'forgetChapter',
                _openId: app.globalData.openId,
                bookName: this.data.bookName,
                chapterName: this.data.chapterName,
            },
        }).then((resp) => {
            app.globalData.userData = resp.result.data[0];
            app.globalData.updateDesk = true;
            this.setData({status: 0});
            wx.hideLoading();
            this.goToNextChapter();
        }).catch((e) => {
            console.log(e);
            this.setData({showUploadTip: true});
            wx.hideLoading();
        });
    },

    reviewChapter: function(){
        wx.showLoading({title: 'Loading'});
        wx.cloud.callFunction({
            name: app.globalData.cloudFunction,
            config: {env: app.globalData.envId},
            data: {
                type: 'reviewChapter',
                _openId: app.globalData.openId,
                bookName: this.data.bookName,
                chapterName: this.data.chapterName,
            },
        }).then((resp) => {
            app.globalData.userData = resp.result.data[0];
            app.globalData.updateDesk = true;
            this.setData({status: 0});
            wx.hideLoading();
            this.goToNextChapter();
        }).catch((e) => {
            console.log(e);
            this.setData({showUploadTip: true});
            wx.hideLoading();
        });
    },

    discardChapter: function(){
        wx.showLoading({title: 'Loading'});
        wx.cloud.callFunction({
            name: app.globalData.cloudFunction,
            config: {env: app.globalData.envId},
            data: {
                type: 'discardChapter',
                _openId: app.globalData.openId,
                bookName: this.data.bookName,
                chapterName: this.data.chapterName,
            },
        }).then((resp) => {
            app.globalData.userData = resp.result.data[0];
            app.globalData.updateChapterCatagory = true;
            app.globalData.updateDesk = true;
            this.setData({status: 0});
            wx.hideLoading();
            wx.showToast({
                title: '将不再背本章节',
                duration: 2000,
            });
            this.goToNextChapter();
        }).catch((e) => {
            console.log(e);
            this.setData({showUploadTip: true});
            wx.hideLoading();
        });
    },

    getPassages: function (){
        wx.showLoading({title: 'Loading'});
        wx.cloud.callFunction({
            name: app.globalData.cloudFunction,
            config: {env: app.globalData.envId},
            data: {
                type: 'readChapter',
                bookName: this.data.bookName,
                chapterName: this.data.chapterName,
            },
        }).then((resp) => {
            this.setData({
                haveGetPassage: true,
                chapterTitle: resp.result.data[0].title,
                centerAlign: resp.result.data[0].centerAlign,
                passage: resp.result.data[0].text,
            });
            wx.hideLoading();
        }).catch((e) => {
            console.log(e);
            this.setData({showUploadTip: true});
            wx.hideLoading();
        });
    },

    onLoad: function (options) {
        this.setData({
            bookName: options.bookName,
            chapterName: options.chapterName,
            status: Number(options.status),
        });
        this.getPassages();
    },

    onPullDownRefresh:function(){
      this.onLoad({
          bookName: this.data.bookName,
          chapterName: this.data.chapterName,
          status: this.data.status,
      });
      wx.stopPullDownRefresh();
    },

})