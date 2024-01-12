// pages/readPassage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showUploadTip: false,
        haveGetPassage: false,
        leftAlign: true,
        centerAlign: false,
        passage: '',
    },

    getPassages: function (){
        wx.showLoading({title: 'Loading'});
        wx.cloud.callFunction({
            name: app.globalData.cloudFunction,
            config: {env: app.globalData.envId},
            data: {type: 'readPassage'},
        }).then((resp) => {
            console.log(resp);
            this.setData({
                haveGetPassage: true,
                passage: resp.result.data,
                leftAlign: !resp.result.data[0].centerAlign,
                centerAlign: resp.result.data[0].centerAlign,
            });
            wx.hideLoading();
        }).catch((e) => {
            console.log(e);
            this.setData({showUploadTip: true});
            wx.hideLoading();
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPassages();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onLoad();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})