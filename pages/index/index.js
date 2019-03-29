//index.js
var app = getApp();
var globalData = app.globalData;
var util = require("../../utils/util.js");
var context = new wx.createCanvasContext('canvasArc', this);
var back = new wx.createCanvasContext('canvasBack')
var sAngle = 1.5 * Math.PI,
  eAngle = 0;
var start_num = null,
  end_num = null
var type
Page({
  data: {
    exerciseType: ["随机练习", "专项练习", "我的收藏", "我的错题"],
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    showChoiceBox: false,
    groups: [],
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
  },
  canvas: function() {
    console.log('start_num:', start_num)
    eAngle = start_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
    context.setStrokeStyle("#41C7DB")
    context.setLineWidth(5)
    // context.fillText(strat_num * 5 <= 100 ? strat_num * 5 + '%' : 100 + '%', 25, 48)
    // 舍去小数了
    context.fillText((start_num / end_num * 100).toFixed(0) + '%', 28, 48)
    context.setFontSize(16)
    context.arc(41, 43, 38, sAngle, eAngle, false)
    context.stroke()
    context.draw()
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
    // libIndex = util.getLibIndex()
    this.setData({
      index: Index,
      show: !this.data.show,
      // collectedSubjects: libIndex === undefined ? [] : ((wx.getStorageSync('librarys') || [])[libIndex].collections === undefined ? [] : (wx.getStorageSync('librarys') || [])[libIndex].collections),
      // wrongSubjects: libIndex === undefined ? [] : ((wx.getStorageSync('librarys') || [])[libIndex].wrongSubjects === undefined ? [] : (wx.getStorageSync('librarys') || [])[libIndex].wrongSubjects),
      // lib: libIndex === undefined ? [] : (wx.getStorageSync('librarys') || [])[libIndex],
      collectedSubjects: globalData.librarys[Index].collections === undefined ? [] : globalData.librarys[Index].collections,
      wrongSubjects: globalData.librarys[Index].wrongSubjects === undefined ? [] : globalData.librarys[Index].wrongSubjects,
      lib: globalData.librarys[Index],
    });
    this.setGroups();
    start_num = globalData.librarys[Index].answeredSubjects === undefined ? 0 : globalData.librarys[Index].answeredSubjects.length;
    end_num = globalData.librarys[Index].subjects.length;
    this.canvas()
    console.log(this.data.lib)
  },

  /**
   * 页面跳转
   */
  showChoiceBox: function() {
    this.setData({
      showChoiceBox: !this.data.showChoiceBox
    })
  },
  
  toExercise: function(e) {
    // globalData.currentExerciseType = e.currentTarget.dataset.type
    type = e.currentTarget.dataset.type
    //专项练习的情况
    if (type === "专项练习") {
      var selectedGroupId = e.target.dataset.id
      var selectedGroupName = e.target.dataset.name
      console.log(selectedGroupId)
      // libraryItemType = "专项"
      wx.navigateTo({
        url: '/pages/exercise/exercise?currentLibraryId=' + globalData.currentLibraryId + "&libraryItemType=" + type + "&selectedGroupId=" + selectedGroupId + "&selectedGroupName=" + selectedGroupName,
      })
      this.setData({
        showChoiceBox: false
      })
    }
    wx.navigateTo({
      url: '/pages/exercise/exercise?currentLibraryId=' + globalData.currentLibraryId + "&libraryItemType=" + type,
    })
  },

  closePopup: function() {
    this.setData({
      showChoiceBox: false,
      show: false,
    })
  },

  setGroups: function() {
    const lib = this.data.lib;
    const groups = lib.groups.map((item) => {
      return {
        name: item.name,
        count: lib.subjects.filter(s => s.groupId === item.id).length,
        id:item.id
      }
    });
    this.setData({
      groups: groups
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var currentData = util.formatTime(new Date());
    // console.log(currentData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
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
var libIndex = this.data.index
    this.setData({
      collectedSubjects: globalData.librarys[libIndex].collections === undefined ? [] : globalData.librarys[libIndex].collections,
      wrongSubjects: globalData.librarys[libIndex].wrongSubjects === undefined ? [] : globalData.librarys[libIndex].wrongSubjects,
      lib: globalData.librarys[libIndex],
    })
    this.setGroups();
    start_num = globalData.librarys[libIndex].answeredSubjects === undefined ? 0 : globalData.librarys[libIndex].answeredSubjects.length
    end_num = globalData.librarys[libIndex].subjects.length;
    if (end_num != 0) {
      this.canvas()
    }
  },
})
