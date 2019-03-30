var app = getApp();
var globalData = app.globalData;
var util = require("../../utils/util.js");
var collections //缓存中的收藏题
var answeredSubjects //缓存中的已答题
var wrongSubjects //缓存中的错题
var logs //缓存中每天做题记录
var currentLibrary //当前题库
var answeredCount = 0 //当前页已经回答过的数量
var rightCount = 0 //当前页已经答对的数量
var consistentRight = [] //记录当前页连续作对的题
var startRememberNum = 0
var endRememberNum = 0
var rememberCount = 0
var exerciseSpendTime = 0
var rememberSpendTime = 0
var startExerciseTime, startRememberTime, endExerciseTime, endRememberTime
var rewards = wx.getStorageSync('rewards') || []
var totalRightCount = wx.getStorageSync('totalRightCount') || 0
var consistencys = wx.getStorageSync('consistencys') || []
var todayAnsweredCount = 0
// var consistentDays
// var consistentDayCount
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isExerciseMode: true, //预设当前项的值
    showRewardBox: false,
    isCollected:false,
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
  clickCollect: function (e) {
    var isCollected
    currentLibrary = this.data.currentLibrary
    var that = this
    var collection;
    var subjectIndex = e.currentTarget.dataset.index
    var subjectSelected = this.data.subject[subjectIndex]
    // collection = currentLibrary.collections === undefined ? [] : currentLibrary.collections
    // if (subjectSelected.isCollected === undefined){
    //   subjectSelected.isCollected=true
    //   collection.push(subjectSelected)
    //   currentLibrary.collections = collection
    //   wx.setStorageSync('librarys', globalData.librarys);
    //   this.setData({
    //     isCollected: subjectSelected.isCollected
    //   })
    // }

    
  // if(collection == false){
  //   collection.push(subjectSelected)
  // }
    // if (this.data.subject[subjectIndex].isCollected === undefined) {
    //   var isCollected = "subject[" + subjectIndex + "].isCollected"
    //   console.log("未定义")
    //   this.setData({
    //     [isCollected]: false
    //   })
    // }
    // console.log(currentLibrary)
    // if (currentLibrary.collections === undefined) {
    //   collection = []
    // } else {
    //   collection = currentLibrary.collections
    // }
    // // 收藏
    // if (this.data.subject[subjectIndex].isCollected === false) {
    //   // 在随机库里收藏，错题库里同时呈现
    //   if (this.data.libraryItem === "随机练习") {
    //     currentLibrary.subjects[subjectIndex].isCollected = true
    //     console.log("wrongSubjects" in currentLibrary)
    //     // if (lib[libIndex].wrongSubjects!= undefined) //陷入死循环
    //     // if (wrongSubjects in lib[libIndex]) { //结果是false
    //     // 只有在出现错题时收藏才执行
    //     if ("wrongSubjects" in currentLibrary) {
    //       for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
    //         if (currentLibrary.wrongSubjects[i].id === currentLibrary.subjects[subjectIndex].id) {
    //           currentLibrary.wrongSubjects[i].isCollected = true
    //         }
    //       }
    //     }
    //   }
    //   // 在错题库里收藏，随机库里同时呈现
    //   if (this.data.libraryItem === "我的错题") {
    //     currentLibrary.wrongSubjects[subjectIndex].isCollected = true
    //     for (var i = 0; i < currentLibrary.subjects.length; i++) {
    //       if (currentLibrary.subjects[i].id === currentLibrary.wrongSubjects[subjectIndex].id) {
    //         currentLibrary.subjects[i].isCollected = true
    //       }
    //     }
    //   }
    //   var isCollected = "subject[" + subjectIndex + "].isCollected"
    //   this.setData({
    //     [isCollected]: true
    //   })
    //   collection.push(subjectSelected)
    //   currentLibrary.collections = collection
    //   wx.setStorageSync('librarys', globalData.librarys);

    // }
    // // 取消收藏
    // else {
    //   var collectionDel = []
    //   console.log(subjectSelected)
    //   for (var i = 0; i < collection.length; i++) {
    //     if (collection[i].id != subjectSelected.id) {
    //       collectionDel.push(collection[i])
    //     }
    //   }
    //   console.log(collectionDel)
    //   // lib[libIndex].collections[subjectIndex].isCollected = false
    //   // 在随机库里取消收藏，随机库里同时取消
    //   if (this.data.libraryItem === "随机练习") {
    //     currentLibrary.subjects[subjectIndex].isCollected = false
    //     for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
    //       if (currentLibrary.wrongSubjects[i].id === currentLibrary.subjects[subjectIndex].id) {
    //         currentLibrary.wrongSubjects[i].isCollected = false
    //       }
    //     }
    //   }
    //   // 在错题库里取消收藏，随机库里同时取消
    //   if (this.data.libraryItem === "我的错题") {
    //     currentLibrary.wrongSubjects[subjectIndex].isCollected = false
    //     for (var i = 0; i < currentLibrary.subjects.length; i++) {
    //       if (currentLibrary.subjects[i].id === currentLibrary.wrongSubjects[subjectIndex].id) {
    //         currentLibrary.subjects[i].isCollected = false
    //       }
    //     }
    //   }
    //   // 在收藏库里取消收藏，错题库与随机库中都取消
    //   if (this.data.libraryItem === "我的收藏") {
    //     currentLibrary.collections[subjectIndex].isCollected = false
    //     for (var i = 0; i < currentLibrary.subjects.length; i++) {
    //       if (currentLibrary.subjects[i].id === currentLibrary.collections[subjectIndex].id) {
    //         currentLibrary.subjects[i].isCollected = false
    //       }
    //     }
    //     for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
    //       if (currentLibrary.wrongSubjects[i].id === currentLibrary.collections[subjectIndex].id) {
    //         currentLibrary.wrongSubjects[i].isCollected = false
    //       }
    //     }
    //   }
    //   currentLibrary.collections = collectionDel
    //   wx.setStorageSync('librarys', globalData.librarys);
    //   var isCollected = "subject[" + subjectIndex + "].isCollected"
    //   this.setData({
    //     [isCollected]: false
    //   })
    // }
    // globalData.collectedSubjectIds = (wx.getStorageSync('librarys') || [])[libIndex].collections
  },

  clickDislike: function (e) {
    this.setData({
      isDislike: !this.data.isDislike,
    })
  },

  clickNote: function (e) {
    this.setData({
      isShowNotePanel: !this.data.isShowNotePanel,
      isShowSettingPanel: false,
    })
  },

  clickSetting: function (e) {
    this.setData({
      isShowNotePanel: false,
      isShowSettingPanel: !this.data.isShowSettingPanel,
    })
  },

  clickInPopupPanel: function (e) {

  },

  clearPopup: function (e) {
    this.setData({
      isShowNotePanel: false,
      isShowSettingPanel: false,
    })
  },

  changeSwiper: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
    console.log(this.data.swiperCurrent)
  },

  /**
   * 公共方法：添加成就记录
   */
  addAchievement(name, disc) {
    var reward = []
    var countList
    var count
    if (rewards == false) { //rewards===[]这种方法是错的
      count = 1
      countList = []
    } else {
      for (var i = 0; i < rewards.length; i++) {
        if (rewards[i].name === name) {
          count = rewards[i].starCount[rewards[i].starCount.length - 1] + 1;
          countList = rewards[i].starCount
          break;
        }
      }
      if (i === rewards.length) {
        countList = []
        count = 1
      }
    }
    countList.push(count)
    var thisRecord = {
      name: name,
      disc: disc,
      starCount: countList
    }
    reward.push(thisRecord)
    console.log(reward)
    if (rewards == false) {
      rewards = reward
    } else {
      for (var i = 0; i < rewards.length; i++) {
        if (rewards[i].name === name) {
          rewards[i] = thisRecord
          break;
        }
      }
      if (i === rewards.length) {
        rewards.push(thisRecord)
      }
    }
    reward = []
    wx.setStorageSync('rewards', rewards)
  },
  /**
   * 判断所选答案是否正确 
   */
  confirmAnswer: function (e) {
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
    if (resultObject.isAnswered === true && this.data.isExerciseMode) {
      answeredCount++;
      // 回答正确
      // 答对自动切换到下一题
      var swiperCurrent = this.data.swiperCurrent;
      if (resultObject.isRight) {
        rightCount++;
        var isInIt = false
        if (currentLibrary.answeredSubjects != undefined) {
          for (var i = 0; i < currentLibrary.answeredSubjects.length; i++) {
            if (currentLibrary.answeredSubjects[i].id === subjectSelected.id) {
              isInIt = true
              break
            }
          }
          if (i === currentLibrary.answeredSubjects.length) {
            totalRightCount++
          }
          if (currentLibrary.wrongSubjects != undefined) {
            currentLibrary.wrongSubjects.forEach((item, index) => {
              if (item.id === subjectSelected.id) {
                totalRightCount++
              }
            })
          }
        } else {
          totalRightCount++
        }
        wx.setStorageSync("totalRightCount", totalRightCount)
        // 百题斩成就
        if (totalRightCount === 100) {
          this.setData({
            showRewardBox: true,
            hundredBeat: true,
          })
          this.addAchievement("百题斩", "正确回答100道题即可达成一次，200道题则达成2次，达成一次积攒100学霸点")
          totalRightCount = 0
        }
        // 20连杀成就
        console.log(currentLibrary.answeredSubjects === undefined)
        console.log(isInIt)
        if (currentLibrary.answeredSubjects === undefined || isInIt === false) {
          consistentRight.push(subjectSelected)
          console.log("持续做对：")
          console.log(consistentRight.length)
          if (consistentRight.length === 20) {
            this.setData({
              showRewardBox: true,
              twentyBeat: true,
            })
            this.addAchievement("20连杀", "连续做对20题则达成一次，要求是从未做过的题目，改成就可无限叠加，达成一次积攒300学霸点")
            consistentRight = []
          }
        }
        console.log(swiperCurrent);
        swiperCurrent = swiperCurrent < (this.data.subject.length - 1) ? swiperCurrent + 1 : 0;
      }
      // 回答错误
      if (resultObject.isRight === false) {
        consistentRight = []
        console.log(consistentRight)
        if (currentLibrary.wrongSubjects === undefined) {
          wrongSubject.push(subjectSelected)
          currentLibrary.wrongSubjects = wrongSubject
        } else {
          for (var i = 0; i < currentLibrary.wrongSubjects.length; i++) {
            if (subjectSelected.id === currentLibrary.wrongSubjects[i].id) {
              break;
            }
          }
          if (i === currentLibrary.wrongSubjects.length) {
            wrongSubject.push(subjectSelected)
            currentLibrary.wrongSubjects = wrongSubject
          }

        }
      }
      // 添加到answeredSubjects中
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
      console.log("未写入缓存时")
      console.log(globalData.librarys)
      // 通关成就
      var isPassed = false
      if (rewards == false) {
        isPassed = false
      } else {
        rewards.forEach((item) => {
          if (item.name === "通关") {
            console.log("通关几次")
            console.log(item.starCount)
            item.starCount.forEach((countItem) => {
              if (this.data.currentLibraryId === countItem) {
                isPassed = true
              }
            })
          }
        })
      }
      if (isPassed === false) {
        if (currentLibrary.answeredSubjects.length === currentLibrary.subjects.length) {
          this.setData({
            passThisLib: true,
            showRewardBox: true
          })
          var passReward = []
          var libIdList = []
          if (rewards == false) {
            libIdList = []
          } else {
            for (var i = 0; i < rewards.length; i++) {
              if (rewards[i].name === "通关") {
                libIdList = rewards[i].starCount;
                break;
              }
            }
            if (i === rewards.length) {
              libIdList = []
            }
          }
          libIdList.push(this.data.currentLibraryId)
          var passThisLibRecord = {
            name: "通关",
            disc: "将一个题库中的题目全部做完，则达成一次，根据其中的题目数量计算学学霸点，2道题可积攒1学霸点",
            starCount: libIdList
          }
          passReward.push(passThisLibRecord)
          if (rewards == false) {
            rewards = passReward
          } else {
            for (var i = 0; i < rewards.length; i++) {
              if (rewards[i].name === "通关") {
                rewards[i] = passThisLibRecord
                break;
              }
            }
            if (i === rewards.length) {
              rewards.push(passThisLibRecord)
            }
          }
          wx.setStorageSync("rewards", rewards) //如果省去出错，因为没出现过对缓存的存储操作
          passReward = []
        }
      }
      wx.setStorageSync("librarys", globalData.librarys)
      console.log("写入缓存时")
      console.log(globalData.librarys)
      this.setData({
        answeredCount: answeredCount,
        rightCount: rightCount,
        // 回答后的交互样式（×和√）
        [userSelectState]: resultObject,
        [answers]: this.data.subject[subjectIndex].answers.map((answer, index) => {
          if (resultObject.isRight) {
            if (index === choise) {
              answer.showRight = true;
            } else { }
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
  },
  confirmAnswer2: function (e) {

  },
  /**
   * 关闭成就弹出框
   */
  closeRewardBox: function () {
    this.setData({
      showRewardBox: false,
      passThisLib: false,
      twentyBeat: false,
      hundredBeat: false,
      sevenDaysConsistency: false
    })
  },
  /**
   * 点击按钮切换答题/背题模式
   */
  switchExerciseNav: function (e) {
    this.setData({
      isExerciseMode: true,
    })
    endRememberNum = this.data.swiperCurrent
    rememberCount = rememberCount + (endRememberNum - startRememberNum)
    startExerciseTime = new Date()
    endRememberTime = startExerciseTime
    rememberSpendTime = rememberSpendTime + (endRememberTime - startRememberTime)
  },
  switchRememberNav: function (e) {
    this.setData({
      isExerciseMode: false
    })
    startRememberNum = this.data.swiperCurrent
    startRememberTime = new Date()
    endExerciseTime = startRememberTime
    exerciseSpendTime = exerciseSpendTime + (endExerciseTime - startExerciseTime)
  },
  imageLoad: function (e) {
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

  previewImage: function (event) {
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
  onLoad: function (options) {
    var that = this;
    that.setData({
      currentLibraryId: options.currentLibraryId,
      libraryItem: options.libraryItemType,
    })
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 记录进入刷题页的时间
    var startDate = util.formatTime(new Date()).split(" ")[0];
    var startTime = new Date()
    startExerciseTime = startTime
    // allen 这subject的值使用全局里面的数据
    const currentLibrary = globalData.librarys.find(item => item.id === globalData.currentLibraryId);
    this.setData({
      currentLibrary: currentLibrary,
      startDate: startDate,
      startTime: startTime,
      // logs: (wx.getStorageSync('logs') || []) === undefined ? [] : (wx.getStorageSync('logs') || [])
      logs: wx.getStorageSync('logs') || []
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
    obj.exec(function (rect) {
      that.setData({
        scrollHeight: rect[0].height
      })
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 公共方法：获取年、月、日、当前月有几天
   */
  getTimeDetail(time) {
    var todayYear = time.getFullYear()
    var todayMonth = time.getMonth() + 1
    var todayDate = time.getDate()
    var maxDay = (new Date(todayYear, todayMonth, 0)).getDate()
    return {
      todayYear: todayYear,
      todayMonth: todayMonth,
      todayDate: todayDate,
      maxDay: maxDay
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    endExerciseTime = new Date();
    endRememberTime = endExerciseTime
    if (!this.data.isExerciseMode) {
      // 背题数量
      endRememberNum = this.data.swiperCurrent
      rememberCount = rememberCount + (endRememberNum - startRememberNum)
      console.log(rememberCount)
      // 背题时间
      rememberSpendTime = rememberSpendTime + (endRememberTime - startRememberTime)
    } else {
      // 刷题时间
      exerciseSpendTime = exerciseSpendTime + (endExerciseTime - startExerciseTime)
    }
    rememberSpendTime = parseInt(rememberSpendTime) / 1000
    exerciseSpendTime = parseInt(exerciseSpendTime) / 1000
    // 记录此次刷题各种数据
    var log = wx.getStorageSync('logs') || []
    var thisRecord = {
      startDate: this.data.startDate,
      exerciseSpendTime: exerciseSpendTime < 60 ? exerciseSpendTime.toFixed(0) + "秒" : (exerciseSpendTime / 60).toFixed(0) + "分钟",
      rememberSpendTime: rememberSpendTime < 60 ? rememberSpendTime.toFixed(0) + "秒" : (rememberSpendTime / 60).toFixed(0) + "分钟",
      answeredCount: answeredCount,
      rightCount: rightCount,
      exerciseType: this.data.libraryItem,
      selectedGroupName: this.data.selectedGroupName,
      rememberCount: rememberCount
    }
    rightCount = 0
    answeredCount = 0
    log.push(thisRecord)
    wx.setStorageSync('logs', log)


    // 7天奋战
    // var consistency = consistencys
    var isConsistent = false
    var todayRecord = (wx.getStorageSync('logs') || []).filter(item => item.startDate === this.data.startDate)
    todayRecord.forEach((item, index) => {
      todayAnsweredCount = todayAnsweredCount + item.answeredCount
    });
    console.log("今天答题题数")
    console.log(todayAnsweredCount)
    if (todayAnsweredCount >= 10) {
      console.log(consistencys == false)
      if (consistencys == false) {
        // consistencys.consistentDayCount = 1
        // consistencys.push(this.data.startTime)
        // consistencys = consistency
        var arr = []
        console.log(new Date())
        arr.push(new Date())
        console.log(arr)
        consistencys.push((new Date()))
      } else {
        // if (util.formatTime(this.data.startTime).split(" ")[0])
        for (var i = 0; i < consistencys.length; i++) {
          // 将缓存中的字符串时间变成Date格式
          var lastDate = util.formatTime(new Date((consistencys[i]))) 
          if (util.formatTime(this.data.startTime).split(" ")[0] === lastDate.split(" ")[0]) {
            break;
          }
        }
        if (i === consistencys.length) {
          var lastExerciseDate = consistencys[consistencys.length - 1]
          // 三种今天与上一次练习时间连续的情况
          var thisTime = this.getTimeDetail(this.data.startTime);
          var thatTime = this.getTimeDetail(new Date((consistencys[i])))
          var caseOne = thatTime.todayYear === thisTime.todayYear && thatTime.todayMonth === thisTime.todayMonth && thatTime.todayDate === thisTime.todayDate - 1
          var caseTwo = thatTime.todayYear === thisTime.todayYear && thatTime.todayMonth === thisTime.todayMonth - 1 && thatTime.todayDate === thatTime.maxDay && thisTime.todayDate === 1
          var caseThree = thatTime.todayYear === thisTime.todayYear - 1 && thatTime.todayMonth === 12 && thisTime.todayMonth === 1 && thatTime.todayDate === thatTime.maxDay && thisTime.todayDate === 1
          if (caseOne || caseTwo || caseThree) {
            isConsistent = true;
          }
          if (isConsistent) {
            // consistencys.consistentDayCount++
            // consistency.push(this.data.startTime)
            // consistencys = consistency
            consistencys.push(this.data.startTime)
            if (consistencys.length === 7) {
              this.setData({
                sevenDaysConsistency: true,
                showRewardBox: true
              })
              this.addAchievement("7天奋战","连续7天刷题10道以上，该项成就可无限叠加，达成一次积攒50学霸点")
            }
          } else {
            // consistencys = []
            // consistency.push(this.data.startDate)
            consistencys = []
            consistencys.push(this.data.startTime)
          }
        }
      }
    }
    wx.setStorageSync("consistencys", consistencys)
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

  },
})