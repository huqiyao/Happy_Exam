// pages/summary/summary.js
var app = getApp();
var globalData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistics: 'complete',
    // lib: globalData.librarys,
  },

  /**
   * 点击Tab切换内容
   */
  switchNav: function(e) {
    this.setData({
      statistics: e.target.dataset.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
sortGroup(array,target){
  
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      lib: globalData.librarys,
    })
    console.log(this.data.lib)
    var totalCount
    var answeredCount
    var wrongCount
    // 每个题库中各种题型的题目总数目
    for (var k = 0; k < this.data.lib.length; k++) {
      var res = [];
      var hash = {};
      var i = 0;
      this.data.lib[k].subjects.forEach(function (item) {
        var groupId = item.groupId;
        hash[groupId] ? res[hash[groupId] - 1].id.push(item.id) : hash[groupId] = ++i && res.push({
          id: [item.id],
          groupId: groupId,
        })
      });
      globalData.librarys[k].groups.forEach((item, index) => {
        for(var j = 0; j < res.length; j++){
          if(item.id === res[j].groupId){
            item.totalCount = res[j].id.length
            wx.setStorageSync('librarys',globalData.librarys);
          }
        }
      })
    }
    // 每个题库中各种题型已经回答过的题目数量
    for (var k = 0; k < this.data.lib.length; k++) {
      var res = [];
      var hash = {};
      var i = 0;
      this.data.lib[k].answeredSubjects.forEach(function (item) {
        var groupId = item.groupId;
        hash[groupId] ? res[hash[groupId] - 1].id.push(item.id) : hash[groupId] = ++i && res.push({
          id: [item.id],
          groupId: groupId,
        })
      });
      globalData.librarys[k].groups.forEach((item, index) => {
        for (var j = 0; j < res.length; j++) {
          if (item.id === res[j].groupId) {
            item.answeredCount = res[j].id.length
            wx.setStorageSync('librarys', globalData.librarys);
          }
        }
      })
    }
    for (var k = 0; k < this.data.lib.length; k++) {
      var res = [];
      var hash = {};
      var i = 0;
      this.data.lib[k].wrongSubjects.forEach(function (item) {
        var groupId = item.groupId;
        hash[groupId] ? res[hash[groupId] - 1].id.push(item.id) : hash[groupId] = ++i && res.push({
          id: [item.id],
          groupId: groupId,
        })
      });
      globalData.librarys[k].groups.forEach((item, index) => {
        for (var j = 0; j < res.length; j++) {
          if (item.id === res[j].groupId) {
            item.wrongCount = res[j].id.length
            wx.setStorageSync('librarys', globalData.librarys);
          }
        }
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})