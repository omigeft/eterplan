// pages/sing_in/sing_in.js
Page({
    data: {
      dateData: [],
      isSignin: false,
      week: ['日','一','二','三','四','五','六'],
    },
    onLoad: function (options) {
        this.initCurrMonthData()
    },
    /**
    * year string 年  如:2020 
    * month string 月 如: 5
    * return array 所有天数 如:[1,2,3...,31]
    **/
    monthDays(year,month){ 
       let days_count = new Date(year,month,0).getDate() //月总天数 如:31
       let days = []; //存放月的天数
       for(let i = 1; i <= days_count; i++)
       days.push(i)
       return days;
    },
    //初始化当月数据
    initCurrMonthData(){
       let currDate = new Date(); //当前日期
       let currMonthDays =  this.monthDays(currDate.getFullYear(),currDate.getMonth() + 1) //当月 +1是因为月从0开始  只有0-11
       let lastMonthDays = this.monthDays(currDate.getFullYear(),currDate.getMonth() ) //上个月
       let currFirstWeek = new Date(currDate.getFullYear(),currDate.getMonth() - 1, 1).getDay() + 1;   //这个月的1号是星期几  -1是因从0开始 
       //月最后一天是星期几
  
       let dateData = [];
       dateData = currMonthDays.map(val => this.formatDay(val)) //当月的数据
  
       for(let i = 0; i < currFirstWeek; i++)  //上月要显示的
       dateData.unshift( 
         this.formatDay( lastMonthDays.pop(),'last')
       );
  
      let nextLenth = 42 - dateData.length;  // 42是因为 6 * 7格式
      for(var i = 1; i <= nextLenth; i++) //下个月需要显示的日期
      dateData.push(
          this.formatDay( i, 'next')
      );
  
      this.setData({
        dateData : dateData
      })
     },
     formatDay(day,type = 'curr'){ //日期数据的格式化
      return {day:day,type:type};
     },
  
     onShareAppMessage: function () {
  
     }
  })