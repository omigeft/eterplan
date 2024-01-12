// index.js
const app = getApp()

Page({
  data: {
    haveAnyBook: false,
    reviewBookNumber: 0,
    reviewChapterNumber: 0,
    serverDate: 0,
    // systemDate: 0,
    consecutivePunchNumber: 0,
    completeLoading: false,
    showUploadTip: false,
    // nightMode: app.globalData.nightMode,
  },

  onLoad: function(){
      //wx.hideTabBar();
      if (this.data.openId){
        this.getUserData()
      }else if (app.globalData.openId){
        this.setData({openId: app.globalData.openId});
        this.getUserData();
      }else{
          app.callback = () => {//回调函数，保证先执行完app.js中函数获取到openId再执行该页面的函数
            this.setData({openId: app.globalData.openId});
            this.getUserData();//getUserData() => getBookList() => getServerDate() => checkBook() => getConsecutivePunchNumber()
          }
      }
      app.globalData.updateDesk = false;
  },

  onShow: function(){
      if (app.globalData.updateDesk) this.onLoad();
  },

  startToReview: function(){
      var reviewListIndex = app.globalData.reviewList.length-1;
      var chapterListIndex = app.globalData.reviewList[reviewListIndex].chapterList.length-1;
      var tempBookName = app.globalData.reviewList[reviewListIndex].set;
      var tempChapterName = app.globalData.reviewList[reviewListIndex].chapterList[chapterListIndex];
      wx.navigateTo({
        url: `/pages/readChapter/index?bookName=${tempBookName}&chapterName=${tempChapterName}&status=${3}`,
      });
  },

  startToLearn: function(){
    wx.navigateTo({
        url: `/pages/myBooks/index?learning=${1}`,
    });
  },

  checkBook: function(){
    var that = this;
    wx.showLoading({title: 'Loading'});
    if (app.globalData.userData.book.length != 0){//用户拥有书籍时
        
        that.setData({
            haveAnyBook: true,
            // systemDate: new Date(),
        });
        let currentBookList = [];
        let reviewChapterNumber = 0;
        for (let i=0; i<app.globalData.userData.book.length; i++){//遍历用户正在读的书籍
            let currentBook = app.globalData.userData.book[i];
            if (currentBook.reading == false) continue;//如果用户不在读就跳过
            let currentChapterList = [];
            let bookMemoryRate = 0;
            for (let j=0; j<currentBook.status.length; j++){//遍历书籍章节
                if (currentBook.status[j].discard == true) continue;//如果该章节已被丢弃则跳过
                let chapterReview = currentBook.status[j].reviewTime;
                let chapterMemoryRate = 0;
                for (let k=0; k<chapterReview.length; k++){//遍历一个章节以前复习的时间,计算出记忆率
                    let hourDif = Math.floor((that.data.serverDate - chapterReview[k])/3600000);//地板除获取小时差
                    // console.log('timeStampDif:'+(that.data.systemDate - chapterReview[k]));
                    // console.log('hourDif:'+hourDif);
                    chapterMemoryRate += 1-0.56*Math.pow(hourDif,0.06);
                }
                // console.log('chapterMemoryRate:'+chapterMemoryRate);
                if (chapterMemoryRate < app.globalData.userData.ratedMemoryRate){//如果低于用户设置的额定记忆率，则加入本书背诵计划
                    bookMemoryRate += chapterMemoryRate;
                    currentChapterList.push(currentBook.status[j].name);
                    reviewChapterNumber++;
                }
            }
            if (currentChapterList.length != 0){//若一本书背诵计划不为空，则将本书加入总背诵计划
                currentBookList.push({
                    bookMemoryRate: bookMemoryRate,
                    chapterList: currentChapterList,
                    set: currentBook.set,
                });
            }
        }
        that.setData({
            reviewBookNumber: currentBookList.length,
            reviewChapterNumber: reviewChapterNumber,
        });
        app.globalData.reviewList = currentBookList;
    }else{
        that.setData({
            haveAnyBook: false,
            haveBookToRead: false,
        });
    }
    this.getConsecutivePunchNumber();
    wx.hideLoading();
    //wx.showTabBar();
    this.setData({completeLoading: true});
  },

  getServerDate: function(){//获取服务器时间
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {type: 'getServerDate'},
    }).then((resp) => {
        this.setData({serverDate: resp.result});
        this.checkBook();
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  getUserData: function (){//获取openId对应的userData
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'selectUserData',
            _openId: app.globalData.openId,
        },
    }).then((resp) => {
        app.globalData.userData = resp.result.data[0];
        // this.getServerDate();
        //this.checkBook();
        this.getBookList();
        wx.hideLoading();
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  getBookList: function (){
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {type: 'library'},
    }).then((resp) => {
        app.globalData.bookList = resp.result.data;
        // this.checkBook();
        this.getServerDate();
        wx.hideLoading();
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
    });
  },

  equalDate: function(x, y){
    x = new Date(x);
    y = new Date(y);
    return x.getFullYear() == y.getFullYear() && x.getMonth() == y.getMonth() && x.getDate() == y.getDate();
  },

  getConsecutivePunchNumber: function(){
    console.log('ss')
    console.log(app.globalData.userData)
    if (app.globalData.userData != {}){
        console.log('xx')
        if (app.globalData.userData.punched.length){
            console.log('yy')
            let lastElem = app.globalData.userData.punched[app.globalData.userData.punched.length-1];
            if (this.equalDate(lastElem, Number(new Date())) || this.equalDate(lastElem, Number(new Date()) - 86400000)){
                let num = 1;
                for (let i = app.globalData.userData.punched.length-2 ; i >= 0 ; i--){
                    if (this.equalDate(app.globalData.userData.punched[i], app.globalData.userData.punched[i+1] - 86400000)) num++;
                    else break;
                }
                this.setData({consecutivePunchNumber: num});
            }else{
                this.setData({consecutivePunchNumber: 0});
            }
        }else{
            this.setData({consecutivePunchNumber: 0});
        }
    }
  },

  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },

});
