//index.js
var app = getApp();
var globalData = app.globalData;
Page({
  data: {
    exerciseType: ["随机练习", "专项练习", "我的收藏", "我的错题", "模拟考试"],
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['语文', '数学', '英语', '科学', '思品', '化学', '生物'], //下拉列表的数据
    index: 0 //选择的下拉列表下标
  },
  /**
   * 选择练习科目
   */
  // 点击下拉显示框
  selectTap: function () {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap: function (e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  /**
   * 页面跳转
   */
  toExercise: function (e) {
    // globalData.currentExerciseType = e.currentTarget.dataset.type
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
    //   url: '',
    // })({
      url: '/pages/exercise/exercise?currentExerciseType=' + type,
      // success: function (e) {  //切换过去要刷新
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) {
      //     return
      //   }
      //   page.onLoad()
      // }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }

})