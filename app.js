//app.js
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    librarys: wx.getStorageSync('librarys') || [],
    currentLibraryId: '1',                      // 当前选中的题库
    currentExerciseType:'',//练习的类型
    wrongSubjectIds: [],                   // 答错的题目
    collectedSubjectIds: [],               // 收藏的题目
  }
})