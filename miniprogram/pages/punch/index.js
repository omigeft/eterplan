// index.js
const app = getApp()

Page({
  data: {
    yearData: 0,
    monthData: 0,
    dateData: [],
    consecutivePunchNumber: 0,
    daysInWeek: ['日','一','二','三','四','五','六'],
    status: -1,
    selectedDate: Number(new Date()),
    showUploadTip: false,
  },

  monthChange: function(e){
    let tempDate = new Date(e.detail.value);
    this.setData({
       selectedDate: tempDate,
       yearData: tempDate.getFullYear(),
       monthData: tempDate.getMonth() + 1,//月范围0-11
    });
    this.initCurrentMonthData();
  },

  monthDays: function(year,month){ 
    let days_count = new Date(year,month+1,0).getDate() //月总天数 如:31
    let days = []; //存放月的天数
    for(let i = 1; i <= days_count; i++) days.push(i);
    return days;
  },

  initCurrentMonthData: function(){
    let selectedDate = this.data.selectedDate; //当前选择日期
    let selectedMonthDays = this.monthDays(selectedDate.getFullYear(),selectedDate.getMonth());//当月天数，当月从0开始  只有0-11
    let firstFewDays = new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1).getDay();//上个月结尾要显示出来的天数
    
    let dateData = [];
    for (let i = 1 ; i <= firstFewDays ; i++){//开头需显示的上个月空白部分
        dateData.push({
            day: ' ',
            status: 0,
        });
    }

    let currDate = new Date();
    //这个月的部分
    //判断某日是否在今日之后，在今日之后则显示为灰色
    if (selectedDate.getFullYear() < currDate.getFullYear()){//选择年份小于今年
        for (let i = 0 ; i < selectedMonthDays.length ; i++){
            dateData.push({
                day: selectedMonthDays[i],
                status: 0,
            });
        }
    }else if (selectedDate.getFullYear() > currDate.getFullYear()){//选择年份大于今年
        for (let i = 0 ; i < selectedMonthDays.length ; i++){
            dateData.push({
                day: selectedMonthDays[i],
                status: 1,
            });
        }
    }else if (selectedDate.getMonth() < currDate.getMonth()){//选择年份等于今年，选择月份小于今年
        for (let i = 0 ; i < selectedMonthDays.length ; i++){
            dateData.push({
                day: selectedMonthDays[i],
                status: 0,
            });
        }
    }else if (selectedDate.getMonth() > currDate.getMonth()){//选择年份等于今年，选择月份大于今年
        for (let i = 0 ; i < selectedMonthDays.length ; i++){
            dateData.push({
                day: selectedMonthDays[i],
                status: 1,
            });
        }
    }else{
        for (let i = 0 ; i < currDate.getDate() ; i++){
            dateData.push({
                day: selectedMonthDays[i],
                status: 0,
            });
        }
        for (let i = currDate.getDate() ; i < selectedMonthDays.length ; i++){
            dateData.push({
                day: selectedMonthDays[i],
                status: 1,
            });
        }
    }

    for (let j = 0 ; j < app.globalData.userData.punched.length ; j++){//判断该月打过卡的日子
        let currVal = new Date(app.globalData.userData.punched[j]);
        if (currVal.getFullYear() > selectedDate.getFullYear()) break;
        if (currVal.getFullYear() < selectedDate.getFullYear()) continue;
        if (currVal.getMonth() > selectedDate.getMonth()) break;
        if (currVal.getMonth() < selectedDate.getMonth()) continue;
        dateData[firstFewDays + currVal.getDate() - 1].status = 2;//punched遇到该月数据，直接对该日的status属性赋值
    }

    //结尾需显示的下个月空白部分
    let preDays = firstFewDays + selectedMonthDays.length;
    if (28 - preDays >= 0){//判断要显示的行数，有可能是4-6行
        for (let i = preDays + 1 ; i <= 28 ; i++){
            dateData.push({
                day: ' ',
                status: 0,
            });
        }
    }else if (35 - preDays >= 0){
        for (let i = preDays + 1 ; i <= 35 ; i++){
            dateData.push({
                day: ' ',
                status: 0,
            });
        }
    }else{
        for (let i = preDays + 1 ; i <= 42 ; i++){
            dateData.push({
                day: ' ',
                status: 0,
            });
        }
    }

    this.setData({
        dateData: dateData,
    });

  },

  getConsecutivePunchNumber: function(){
    if (app.globalData.userData.punched.length){
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
  },

  onLoad: function(options){
    if (app.globalData.userData.punched.length){
        let lastElem = app.globalData.userData.punched[app.globalData.userData.punched.length-1];
        if (this.equalDate(lastElem, Number(new Date()))){
            this.setData({status: 2});
        }else{
            if (app.globalData.reviewList.length){
                this.setData({status: 3});
            }else{
                this.setData({status: 0});
            }
        }
    }else{
        if (app.globalData.reviewList.length){
            this.setData({status: 3});
        }else{
            this.setData({status: 0});
        }
    }
    this.monthChange({detail: {value: new Date()}});
    this.getConsecutivePunchNumber();
  },

  punchToday: function(){
    wx.showLoading({title: 'Loading'});
    wx.cloud.callFunction({
        name: app.globalData.cloudFunction,
        config: {env: app.globalData.envId},
        data: {
            type: 'punch',
            _openId: app.globalData.openId,
        },
    }).then((resp) => {
        app.globalData.userData = resp.result.data[0];
        this.setData({status: 1});
        this.monthChange({detail: {value: new Date()}});
        this.getConsecutivePunchNumber();
        wx.hideLoading();
        wx.showToast({
            title: '已打卡！',
            duration: 2000,
        });
    }).catch((e) => {
        console.log(e);
        this.setData({showUploadTip: true});
        wx.hideLoading();
    });
  },

  returnToDesk: function(){
    wx.reLaunch({
      url: '/pages/desk/index',
    })
  },
  
  equalDate: function(x, y){
    x = new Date(x);
    y = new Date(y);
    return x.getFullYear() == y.getFullYear() && x.getMonth() == y.getMonth() && x.getDate() == y.getDate();
  },

  onPullDownRefresh:function(){
    this.onLoad();
    wx.stopPullDownRefresh();
  },

});
