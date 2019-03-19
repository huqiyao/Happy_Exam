var app = getApp();
var globalData = app.globalData;
var util
var common = require("../../utils/util.js");
var libIndex
var lib = globalData.librarys
var collections
var answeredSubjects
var wrongSubjects
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
    libIndex = common.getLibIndex()
    // var that = this
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
    console.log(lib[libIndex])
    if (lib[libIndex].collections === undefined) {
      collection = []
    } else {
      collection = lib[libIndex].collections
    }
    // 收藏
    if (this.data.subject[subjectIndex].isCollected === false) {
      // 在随机库里收藏，错题库里同时呈现
      if (this.data.libraryItem === "随机") {
        lib[libIndex].subjects[subjectIndex].isCollected = true
        console.log("wrongSubjects" in lib[libIndex])
        // if (lib[libIndex].wrongSubjects!= undefined) //陷入死循环
        // if (wrongSubjects in lib[libIndex]) { //结果是false
        // 只有在出现错题时收藏才执行
        if ("wrongSubjects" in lib[libIndex]) {
          for (var i = 0; i < lib[libIndex].wrongSubjects.length; i++) {
            if (lib[libIndex].wrongSubjects[i].id === lib[libIndex].subjects[subjectIndex].id) {
              lib[libIndex].wrongSubjects[i].isCollected = true
            }
          }
        }
      }
      // 在错题库里收藏，随机库里同时呈现
      if (this.data.libraryItem === "错题") {
        lib[libIndex].wrongSubjects[subjectIndex].isCollected = true
        for (var i = 0; i < lib[libIndex].subjects.length; i++) {
          if (lib[libIndex].subjects[i].id === lib[libIndex].wrongSubjects[subjectIndex].id) {
            lib[libIndex].subjects[i].isCollected = true
          }
        }
      }
      var isCollected = "subject[" + subjectIndex + "].isCollected"
      this.setData({
        [isCollected]: true
      })
      collection.push(subjectSelected)
      lib[libIndex].collections = collection
      wx.setStorageSync('librarys', lib);

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
      if (this.data.libraryItem === "随机") {
        lib[libIndex].subjects[subjectIndex].isCollected = false
        for (var i = 0; i < lib[libIndex].wrongSubjects.length; i++) {
          if (lib[libIndex].wrongSubjects[i].id === lib[libIndex].subjects[subjectIndex].id) {
            lib[libIndex].wrongSubjects[i].isCollected = false
          }
        }
      }
      // 在错题库里取消收藏，随机库里同时取消
      if (this.data.libraryItem === "错题") {
        lib[libIndex].wrongSubjects[subjectIndex].isCollected = false
        for (var i = 0; i < lib[libIndex].subjects.length; i++) {
          if (lib[libIndex].subjects[i].id === lib[libIndex].wrongSubjects[subjectIndex].id) {
            lib[libIndex].subjects[i].isCollected = false
          }
        }
      }
      // 在收藏库里取消收藏，错题库与随机库中都取消
      if (this.data.libraryItem === "收藏") {
        lib[libIndex].collections[subjectIndex].isCollected = false
        for (var i = 0; i < lib[libIndex].subjects.length; i++) {
          if (lib[libIndex].subjects[i].id === lib[libIndex].collections[subjectIndex].id) {
            lib[libIndex].subjects[i].isCollected = false
          }
        }
        for (var i = 0; i < lib[libIndex].wrongSubjects.length; i++) {
          if (lib[libIndex].wrongSubjects[i].id === lib[libIndex].collections[subjectIndex].id) {
            lib[libIndex].wrongSubjects[i].isCollected = false
          }
        }
      }
      lib[libIndex].collections = collectionDel
      wx.setStorageSync('librarys', lib);
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
  },


  /**
   * 判断所选答案是否正确 
   */
  confirmAnswer: function(e) {
    // var that = this
    var answeredSubject
    var wrongSubject
    libIndex = common.getLibIndex()
    var subjectIndex = e.target.dataset.index
    var subjectSelected = this.data.subject[subjectIndex]
    var result = this.data.subject[subjectIndex].rightAnswerIndex
    var choise = e.target.dataset.select
    var userSelectState = "subject[" + subjectIndex + "].userSelectState"; //先用一个变量，把(subject[itemIndex]. userSelectState)用字符串拼接起来,//第一次出错是因为字符串中无端出现空格
    var answers = "subject[" + subjectIndex + "].answers";
    var resultObject = {
      isAnswered: true,
      isRight: result === choise,
      userSelectIndex: choise
    }
    lib[libIndex].answeredSubjects === undefined ? answeredSubject = [] : answeredSubject = lib[libIndex].answeredSubjects
    lib[libIndex].wrongSubjects === undefined ? wrongSubject = [] : wrongSubject = lib[libIndex].wrongSubjects
    // 答对自动切换到下一题
    var swiperCurrent = this.data.swiperCurrent;
    if (resultObject.isRight) {
      console.log(swiperCurrent);
      swiperCurrent = swiperCurrent < (this.data.subject.length - 1) ? swiperCurrent + 1 : 0;
    }
    if (resultObject.isAnswered === true && lib[libIndex].subjects[subjectIndex].userSelectState === undefined && this.data.isExerciseMode) {
      // 回答错误
      if (resultObject.isRight === false) {
        wrongSubject.push(subjectSelected)
        lib[libIndex].wrongSubjects = wrongSubject
      }
      answeredSubject.push(subjectSelected)
      lib[libIndex].answeredSubjects = answeredSubject
      lib[libIndex].subjects[subjectIndex].userSelectState = resultObject
      wx.setStorageSync('librarys', lib);
      // 回答后的交互样式（×和√）
      this.setData({
        [userSelectState]: resultObject,
        [answers]: this.data.subject[subjectIndex].answers.map((answer, index) => {
          if (resultObject.isRight) {
            if (index === choise) {
              // answer.optionStyle = resultObject.isRight ? 'user-answer-right' : 'user-answer-wrong';
              // answer.optionStyle = 'user-answer-right';
              answer.showRight = true;
            } else {
              // answer.optionStyle = '';
            }
          } else {
            if (index === result) {
              // answer.optionStyle = 'user-answer-right';
              answer.showRight = true;
            } else if (index === choise) {
              // answer.optionStyle = 'user-answer-wrong';
              answer.showWrong = true;
            }
          }
          return answer;
        }),
        swiperCurrent: swiperCurrent,
      });
    }

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
  },
  switchRememberNav: function(e) {
    this.setData({
      isExerciseMode: false
    })
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
    that.setData({
      currentLibraryId: options.currentLibraryId,
      libraryItem: options.libraryItemType,

    })
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
    // allen 这subject的值使用全局里面的数据
    const currentLibrary = globalData.librarys.find(item => item.id === globalData.currentLibraryId);
    console.log(currentLibrary)
    if (currentLibrary) {
      console.log(currentLibrary.subjects)
      // console.log(options.libraryItemType)
      if (this.data.libraryItem === "随机") {
        this.setData({
          subject: currentLibrary.subjects.map(item => ({
            ...item,
            //       userSelectState: {
            //   isAnswered: false,
            // },
            // isCollected: false,
            // star: stars
          }))
        })
      }
      if (this.data.libraryItem === "收藏") {
        this.setData({
          subject: currentLibrary.collections.map(item => ({
            ...item
          }))
        })
      }
      if (this.data.libraryItem === "错题") {
        this.setData({
          subject: currentLibrary.wrongSubjects.map(item => ({
            ...item
          }))
        })
      }
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