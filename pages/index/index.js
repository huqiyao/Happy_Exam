//index.js
// var collections
var app = getApp();
var globalData = app.globalData;
var context = new wx.createCanvasContext('canvasArc', this);
var back = new wx.createCanvasContext('canvasBack')
var strat_num = 1,
  end_num = 20;
var sAngle = 1.5 * Math.PI,
  eAngle = 0;
Page({
  data: {
    exerciseType: ["随机练习", "专项练习", "我的收藏", "我的错题"],
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列表下标
  },
  /**
   * 进度条
   */
  onReady: function() {
    // 画背景圆
    back.setStrokeStyle("#eaeaea")
    back.setLineWidth(5)
    back.setLineCap('round');
    back.beginPath();
    back.arc(41, 43, 38, 0, 2 * Math.PI, false)
    back.stroke()
    back.draw()
    // 画动态进度条
    this.canvas()
  },
  canvas: function() {
    var that = this;
    if (strat_num <= end_num) {
      console.log('strat_num:', strat_num)
      eAngle = strat_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
      setTimeout(function() {
        context.setStrokeStyle("#41C7DB")
        context.setLineWidth(5)
        context.fillText(strat_num * 5 <= 100 ? strat_num * 5 + '%' : 100 + '%', 25, 48)
        context.setFontSize(15)
        context.arc(41, 43, 38, sAngle, eAngle, false)
        context.stroke()
        context.draw()
        that.canvas()
        strat_num++
      }, 200)
    } else {
      console.log('strat_num_end:', strat_num)
    }
  },
  /**
   * 选择练习科目
   */
  // 点击下拉显示框
  selectTap: function() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap: function(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    globalData.currentLibraryId = globalData.librarys[Index].id;
    this.setData({
      index: Index,
      show: !this.data.show,
      collectedSubjectIds: (globalData.librarys[globalData.currentLibraryId - 1]) === undefined ? [] : ((wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].collections === undefined ? [] : (wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].collections),
      wrongSubjectIds: (globalData.librarys[globalData.currentLibraryId - 1]) === undefined ? [] : ((wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].wrongSubjects === undefined ? [] : (wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].wrongSubjects)
    });
  },
  /**
   * 页面跳转
   */
  toExercise: function(e) {
    // globalData.currentExerciseType = e.currentTarget.dataset.type
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      // url: '/pages/exercise/exercise?currentExerciseType=' + type,
      url: '/pages/exercise/exercise?currentLibraryId=' + globalData.currentLibraryId,
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
  onLoad: function(options) {
    let curIndex = 0;
    const selectData = [];
    globalData.librarys.forEach((item, index) => {
      if (item.id === globalData.currentLibraryId) {
        curIndex = index;
      }
      selectData.push(item.name);
    })
    this.setData({
      selectData,
      index: curIndex
    });
  },
  onShow: function(options) {
    this.optionTap
    this.setData({
      // collectedSubjectIds: globalData.collectedSubjectIds
      collectedSubjectIds: (globalData.librarys[globalData.currentLibraryId - 1]) === undefined ? [] : ((wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].collections === undefined ? [] : (wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].collections),
      wrongSubjectIds: (globalData.librarys[globalData.currentLibraryId - 1]) === undefined ? [] : ((wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].wrongSubjects === undefined ? [] : (wx.getStorageSync('librarys') || [])[globalData.currentLibraryId - 1].wrongSubjects)


    })
    console.log(globalData.librarys[globalData.currentLibraryId - 1])
  }

})