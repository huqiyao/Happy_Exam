// pages/summary/summary.js
var app = getApp();
var globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistics:'complete',
    lib: globalData.librarys,
    // rightNumWidth: "100 * ((lib[libIndex].answeredSubjects === undefinded ? 0 : lib[libIndex].answeredSubjects.length) - (lib[libIndex].wrongSubjects === undefinded ? 0 : lib[libIndex].wrongSubjects.length)) / lib[libIndex].subjects.length + '%'"
  },

  /**
   * 点击Tab切换内容
   */
  switchNav: function (e) {
this.setData({
  statistics: e.target.dataset.current
})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log(this.data.lib)
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