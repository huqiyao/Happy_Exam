var app = getApp();
var globalData = app.globalData;
var util = require("../../utils/util.js");
var collections
var answeredSubjects
var wrongSubjects
var logs
var currentLibrary
var answeredCount = 0
var rightCount = 0
var startRememberNum = 0
var endRememberNum = 0
var rememberCount = 0
var exerciseSpendTime = 0
var rememberSpendTime = 0
var startExerciseTime, startRememberTime, endExerciseTime, endRememberTime
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isExerciseMode: true, //预设当前项的值
    settingItems: [{
        name: 'autoSwitch',
        value: '答对自动切题'
      },
      {
        name: 'filterDislike',
        value: '过滤被屏蔽的题目',
        checked: 'true'
      },
    ],

    // isCollected: false,
    isDislike: false,
    isShowNotePanel: false,
    isShowSettingPanel: false,
    imgUrl: "http://wximg.youtasc.com/star.png",
    markedImgUrl: "http://wximg.youtasc.com/f_star.png",

    swiperCurrent: 0,
    scrollHeight: 0,

    images: [],
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  /**
   * 收藏题目
   */
  clickCollect: function(e) {
    currentLibrary = this.data.currentLibrary
    // libIndex = common.getLibIndex()
    var that = this
    var collection;
    var subjectIndex = e.currentTarget.dataset.index
    var subjectSelected = this.data.subject[subjectIndex]
    if (this.data.subject[subjectIndex].isCollected === undefined) {
      var isCollected = "subject[" + subjectIndex + "].isCollected"
      console.log("未定义")
      this.setData({
        [isCollected]: false
      })
    }
    console.log(currentLibrary)
    if (currentLibrary.collections === undefined) {
      collection = []
    } else {
      collection = currentLibrary.collections
    }
    // 收藏
    if (this.data.subject[subjectIndex].isCollected === false) {
      // 在随机库里收藏，错题库里同时呈现
      if (this.data.libraryItem === "随机练习") {
        currentLibrary.subjects[subjectIndex].isCollected = true
        console.log("wrongSubjects" in currentLibrary)
        // if (lib[libIndex].wrongSubjects!= undefined) //陷入死循环
        // if (wrongSubjects in lib[libIndex]) { //结果是false
        // 只有在出现错题时收藏才执行
        if ("wrongSubjects" in currentLibrary) {
          for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
            if (currentLibrary.wrongSubjects[i].id === currentLibrary.subjects[subjectIndex].id) {
              currentLibrary.wrongSubjects[i].isCollected = true
            }
          }
        }
      }
      // 在错题库里收藏，随机库里同时呈现
      if (this.data.libraryItem === "我的错题") {
        currentLibrary.wrongSubjects[subjectIndex].isCollected = true
        for (var i = 0; i < currentLibrary.subjects.length; i++) {
          if (currentLibrary.subjects[i].id === currentLibrary.wrongSubjects[subjectIndex].id) {
            currentLibrary.subjects[i].isCollected = true
          }
        }
      }
      var isCollected = "subject[" + subjectIndex + "].isCollected"
      this.setData({
        [isCollected]: true
      })
      collection.push(subjectSelected)
      currentLibrary.collections = collection
      wx.setStorageSync('librarys', globalData.librarys);

    }
    // 取消收藏
    else {
      var collectionDel = []
      console.log(subjectSelected)
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].id != subjectSelected.id) {
          collectionDel.push(collection[i])
        }
      }
      console.log(collectionDel)

      // lib[libIndex].collections[subjectIndex].isCollected = false
      // 在随机库里取消收藏，随机库里同时取消
      if (this.data.libraryItem === "随机练习") {
        currentLibrary.subjects[subjectIndex].isCollected = false
        for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
          if (currentLibrary.wrongSubjects[i].id === currentLibrary.subjects[subjectIndex].id) {
            currentLibrary.wrongSubjects[i].isCollected = false
          }
        }
      }
      // 在错题库里取消收藏，随机库里同时取消
      if (this.data.libraryItem === "我的错题") {
        currentLibrary.wrongSubjects[subjectIndex].isCollected = false
        for (var i = 0; i < currentLibrary.subjects.length; i++) {
          if (currentLibrary.subjects[i].id === currentLibrary.wrongSubjects[subjectIndex].id) {
            currentLibrary.subjects[i].isCollected = false
          }
        }
      }
      // 在收藏库里取消收藏，错题库与随机库中都取消
      if (this.data.libraryItem === "我的收藏") {
        currentLibrary.collections[subjectIndex].isCollected = false
        for (var i = 0; i < currentLibrary.subjects.length; i++) {
          if (currentLibrary.subjects[i].id === currentLibrary.collections[subjectIndex].id) {
            currentLibrary.subjects[i].isCollected = false
          }
        }
        for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
          if (currentLibrary.wrongSubjects[i].id === currentLibrary.collections[subjectIndex].id) {
            currentLibrary.wrongSubjects[i].isCollected = false
          }
        }
      }
      currentLibrary.collections = collectionDel
      wx.setStorageSync('librarys', globalData.librarys);
      var isCollected = "subject[" + subjectIndex + "].isCollected"
      this.setData({
        [isCollected]: false
      })
    }
    // globalData.collectedSubjectIds = (wx.getStorageSync('librarys') || [])[libIndex].collections
  },

  clickDislike: function(e) {
    this.setData({
      isDislike: !this.data.isDislike,
    })
  },

  clickNote: function(e) {
    this.setData({
      isShowNotePanel: !this.data.isShowNotePanel,
      isShowSettingPanel: false,
    })
  },

  clickSetting: function(e) {
    this.setData({
      isShowNotePanel: false,
      isShowSettingPanel: !this.data.isShowSettingPanel,
    })
  },

  clickInPopupPanel: function(e) {

  },

  clearPopup: function(e) {
    this.setData({
      isShowNotePanel: false,
      isShowSettingPanel: false,
    })
  },

  changeSwiper: function(e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
    console.log(this.data.swiperCurrent)
  },


  /**
   * 判断所选答案是否正确 
   */
  confirmAnswer: function(e) {
    currentLibrary = this.data.currentLibrary
    var answeredSubject
    var wrongSubject
    var subjectIndex = e.target.dataset.index
    var subjectSelected = this.data.subject[subjectIndex]
    var result = this.data.subject[subjectIndex].rightAnswerIndex
    var choise = e.target.dataset.select
    var userSelectState = "subject[" + subjectIndex + "].userSelectState"; //先用一个变量，把(subject[itemIndex]. userSelectState)用字符串拼接起来,//第一次出错是因为字符串中无端出现空格
    var answers = "subject[" + subjectIndex + "].answers";
    if (this.data.subject[subjectIndex].userSelectState.isAnswered || !this.data.isExerciseMode) {
      return;
    }
    var resultObject = {
      isAnswered: true,
      isRight: result === choise,
      userSelectIndex: choise
    }
    currentLibrary.answeredSubjects === undefined ? answeredSubject = [] : answeredSubject = currentLibrary.answeredSubjects
    currentLibrary.wrongSubjects === undefined ? wrongSubject = [] : wrongSubject = currentLibrary.wrongSubjects

    // if (resultObject.isAnswered === true && lib[libIndex].subjects[subjectIndex].userSelectState === undefined && this.data.isExerciseMode) {

    if (resultObject.isAnswered === true && this.data.isExerciseMode) {

      answeredCount++;

      if (currentLibrary.answeredSubjects === undefined) {
        answeredSubject.push(subjectSelected)
        currentLibrary.answeredSubjects = answeredSubject
      } else {
        for (var i = 0; i < currentLibrary.answeredSubjects.length; i++) {
          console.log(i)
          if (subjectSelected.id === currentLibrary.answeredSubjects[i].id) {
            break
          }
        }
        if (i === currentLibrary.answeredSubjects.length) {
          answeredSubject.push(subjectSelected)
          currentLibrary.answeredSubjects = answeredSubject
        }
      }

      // 回答正确
      // 答对自动切换到下一题
      var swiperCurrent = this.data.swiperCurrent;
      if (resultObject.isRight) {
        rightCount++;

        console.log(swiperCurrent);
        swiperCurrent = swiperCurrent < (this.data.subject.length - 1) ? swiperCurrent + 1 : 0;
      }
      // 回答错误
      if (resultObject.isRight === false) {
        if (currentLibrary.wrongSubjects === undefined) {
          wrongSubject.push(subjectSelected)
          currentLibrary.wrongSubjects = wrongSubject
        } else {
          for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
            if (subjectSelected.id === currentLibrary.wrongSubjects[i].id) {
              break
            }
          }
          if (i === currentLibrary.wrongSubjects.length) {
            wrongSubject.push(subjectSelected)
            currentLibrary.wrongSubjects = wrongSubject
          }

        }
      }
      wx.setStorageSync('librarys', globalData.librarys);
      this.setData({
        answeredCount: answeredCount,
        rightCount: rightCount,
        // 回答后的交互样式（×和√）
        [userSelectState]: resultObject,
        [answers]: this.data.subject[subjectIndex].answers.map((answer, index) => {
          if (resultObject.isRight) {
            if (index === choise) {
              answer.showRight = true;
            } else {}
          } else {
            if (index === result) {
              answer.showRight = true;
            } else if (index === choise) {
              answer.showWrong = true;
            }
          }
          return answer;
        }),
        swiperCurrent: swiperCurrent,
      });
    }
    console.log("已经做过的题：")
    console.log(this.data.answeredCount)
    console.log("作对的题：")
    console.log(this.data.rightCount)
    console.log(this.data.subject[subjectIndex].userSelectState)
  },

  confirmAnswer2: function(e) {

  },

  /**
   * 点击按钮切换答题/背题模式
   */
  switchExerciseNav: function(e) {
    // this.setData({
    //   currentTab: e.target.dataset.current //current来源于data-current
    // })
    this.setData({
      isExerciseMode: true,
    })
    endRememberNum = this.data.swiperCurrent
    rememberCount = rememberCount + (endRememberNum - startRememberNum)
    startExerciseTime = new Date()
    endRememberTime = startExerciseTime
    rememberSpendTime = rememberSpendTime + (endRememberTime - startRememberTime)
  },
  switchRememberNav: function(e) {
    this.setData({
      isExerciseMode: false
    })
    startRememberNum = this.data.swiperCurrent
    startRememberTime = new Date()
    endExerciseTime = startRememberTime
    exerciseSpendTime = exerciseSpendTime+(endExerciseTime - startExerciseTime)
  },
  imageLoad: function(e) {
    var width = e.detail.width; //获取图片真实宽度
    var height = e.detail.height;
    var viewHeight, viewWidth;
    if (width >= height) {
      viewWidth = 150;
      viewHeight = 150 * height / width;
    } else {
      viewWidth = 150 * width / height;
      viewHeight = 150;
    }

    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },

  previewImage: function(event) {
    var index = event.currentTarget.dataset.index; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: imgList[index], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // var selectedGroupId
    that.setData({
      currentLibraryId: options.currentLibraryId,
      libraryItem: options.libraryItemType,
    })
    // console.log(libraryItem)
    if (this.data.libraryItem === '专项练习') {
      that.setData({
        selectedGroupId: options.selectedGroupId,
        selectedGroupName: options.selectedGroupName
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 记录进入刷题页的时间
    var startDate = util.formatTime(new Date()).split(" ")[0];
    startExerciseTime = new Date()
    // var startTime = util.formatTime(new Date()).split(" ")[1];
    // allen 这subject的值使用全局里面的数据
    const currentLibrary = globalData.librarys.find(item => item.id === globalData.currentLibraryId);
    this.setData({
      currentLibrary: currentLibrary,
      startDate: startDate,
      logs: (wx.getStorageSync('logs') || []) === undefined ? [] : (wx.getStorageSync('logs') || [])
    })
    console.log(currentLibrary)
    console.log(this.data.startDate)
    if (currentLibrary) {
      console.log(currentLibrary.subjects)
      // 重新进入时，去除之前选择后的样式
      currentLibrary.subjects.forEach((item, index) => {
        item.answers.map((answer, index) => {
          answer.showRight = ''
          answer.showWrong = ''
        })
      })
      var currentSubjects
      if (this.data.libraryItem === "随机练习") {
        currentSubjects = currentLibrary.subjects
      }
      if (this.data.libraryItem === "我的收藏") {
        currentSubjects = currentLibrary.collections
      }
      if (this.data.libraryItem === "我的错题") {
        currentSubjects = currentLibrary.wrongSubjects
      }
      if (this.data.libraryItem === "专项练习") {
        var selectedGroup = []
        currentLibrary.subjects.forEach((item, index) => {
          if (item.groupId === this.data.selectedGroupId) {
            selectedGroup.push(item)
          }
        })
        this.setData({
          selectedGroup: selectedGroup
        })
        currentSubjects = this.data.selectedGroup
      }
      this.setData({
        subject: currentSubjects.map(item => ({
          ...item,
          userSelectState: {
            isAnswered: false,
          },
        }))
      })
    }
    var that = this;
    var obj = wx.createSelectorQuery();
    obj.select('.change-content').boundingClientRect();
    obj.exec(function(rect) {
      that.setData({
        scrollHeight: rect[0].height
      })
    });
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
    endExerciseTime = new Date();
    endRememberTime = endExerciseTime
    if(!this.data.isExerciseMode){
      // 背题数量
      endRememberNum = this.data.swiperCurrent
      rememberCount = rememberCount + (endRememberNum - startRememberNum)
      console.log(rememberCount)
      // 背题时间
      rememberSpendTime = rememberSpendTime + (endRememberTime - startRememberTime)
    }
    else{
      // 刷题时间
      exerciseSpendTime = exerciseSpendTime + (endExerciseTime - startExerciseTime)
    }
    rememberSpendTime = parseInt(rememberSpendTime)/1000
    exerciseSpendTime = parseInt(exerciseSpendTime) / 1000
    // 记录此次刷题各种数据
    var log = (wx.getStorageSync('logs') || []) === undefined ? [] : (wx.getStorageSync('logs') || [])
    // var endDate = util.formatTime(new Date()).split(" ")[0];
    // var difference = parseInt(endTime - this.data.startTime)/1000
    // var spendTime = difference < 60 ? difference.toFixed(0) + "秒" : (difference / 60).toFixed(0) + "分钟"
    // console.log(spendTime)
    var thisRecord = {
      startDate:this.data.startDate,
      exerciseSpendTime: exerciseSpendTime < 60 ? exerciseSpendTime.toFixed(0) + "秒" : (exerciseSpendTime / 60).toFixed(0) + "分钟",
      rememberSpendTime: rememberSpendTime < 60 ? rememberSpendTime.toFixed(0) + "秒" : (rememberSpendTime / 60).toFixed(0) + "分钟",
      answeredCount:answeredCount,
      rightCount:rightCount,
      exerciseType:this.data.libraryItem,
      selectedGroupName: this.data.selectedGroupName,
      rememberCount:rememberCount
    }
    log.push(thisRecord)
    wx.setStorageSync('logs',log)
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

  },
})