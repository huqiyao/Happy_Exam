var app = getApp();
var globalData = app.globalData;
var util
// var libIndex = 0
// var lib = wx.getStorageSync('librarys') || []
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
    var libIndex = this.data.currentLibraryId - 1
    // var that = this
    var collection;
    var subjectIndex = e.currentTarget.dataset.index
    var subjectId = this.data.subject[subjectIndex].id
    // this.setData
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
      collection.push(subjectId)
      lib[libIndex].collections = collection
      lib[libIndex].subjects[subjectIndex].isCollected = true
      wx.setStorageSync('librarys', lib);
      var isCollected = "subject[" + subjectIndex + "].isCollected"
      this.setData({
        [isCollected]: lib[libIndex].subjects[subjectIndex].isCollected
      })
    }
    // 取消收藏
    else {
      var collectionDel = []
      for (var i = 0; i < collection.length; i++) {
        if (collection[i] != subjectId) {
          collectionDel.push(collection[i])
        }
        lib[libIndex].collections = collectionDel
        lib[libIndex].subjects[subjectIndex].isCollected = false
        wx.setStorageSync('librarys', lib);
        var isCollected = "subject[" + subjectIndex + "].isCollected"
        this.setData({
          [isCollected]: lib[libIndex].subjects[subjectIndex].isCollected
        })
      }
    }
    globalData.collectedSubjectIds = (wx.getStorageSync('librarys') || [])[libIndex].collections
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
    var libIndex = this.data.currentLibraryId - 1
    var subjectIndex = e.target.dataset.index
    var subjectId = this.data.subject[subjectIndex].id
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
    if (resultObject.isRight){
      console.log(swiperCurrent);
      swiperCurrent = swiperCurrent < (this.data.subject.length - 1) ? swiperCurrent + 1 : 0;
    }
    if (resultObject.isAnswered === true && lib[libIndex].subjects[subjectIndex].userSelectState === undefined && this.data.isExerciseMode) {
      // 回答错误
      if (resultObject.isRight === false) {
        wrongSubject.push(subjectId)
        lib[libIndex].wrongSubjects = wrongSubject
      }
      answeredSubject.push(subjectId)
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
    // if (lib[libIndex].subjects[subjectIndex].userSelectState.isAnswered === true || !this.data.isExerciseMode) {
    //   //  加上!this.data.isExerciseMode，否则背题模式下的选择会显示在答题模式下
    //   return;
    // }

    console.log(this.data.subject[subjectIndex].userSelectState)
    // globalData.wrongSubjectIds = (wx.getStorageSync('librarys') || [])[libIndex].collections
  },

  confirmAnswer2: function(e) {

  },

  /**
   * 给题目评价打星
   */
  // markIt: function(e) {
  //   var starIndex = e.target.dataset.select;
  //   var itemIndex = e.target.dataset.index;
  //   var starFlag = this.data.subject[itemIndex].star[starIndex].flag
  //   console.log(starIndex)
  //   console.log(itemIndex)
  //   console.log(starFlag)
  //   if (starFlag === 0) {
  //     for (var i = 0; i <= starIndex; i++) {
  //       var thisFlag = "subject[" + itemIndex + "].star[" + i + "].flag"
  //       this.setData({
  //         [thisFlag]: 1
  //       })
  //     }
  //   } else {
  //     for (var j = starIndex + 1; j <= 5; j++) {
  //       var thisFlag = "subject[" + itemIndex + "].star[" + j + "].flag"
  //       this.setData({
  //         [thisFlag]: 0
  //       })
  //     }
  //   }
  // },
  // /**
  //  * 收藏题目
  //  */
  // collectIt: function(e) {
  //   var itemIndex = e.target.dataset.index;
  //   var isCollected = this.data.subject[itemIndex].collection
  //   console.log(itemIndex)
  //   console.log(isCollected)
  //   var thisCollection = "subject[" + itemIndex + "].collection"
  //   if (isCollected === false) {
  //     this.setData({
  //       [thisCollection]: true
  //     })
  //     //修改全局变量的值
  //     var collectedSubject = globalData.collectedSubjectIds;
  //     if (collectedSubject.indexOf(itemIndex) == -1) {
  //       collectedSubject.push(itemIndex)
  //     }
  //     console.log(isCollected)
  //     console.log(collectedSubject)
  //   } else {
  //     this.setData({
  //       [thisCollection]: false
  //     })
  //     console.log(isCollected)
  //   }

  //   wx.showToast({
  //     title: isCollected ? '已取消收藏' : '收藏成功',
  //     duration: 1000,
  //     icon: "success",
  //     mask: true
  //   })
  // },
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
      currentLibraryId: options.currentLibraryId
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
      this.setData({
        subject: currentLibrary.subjects.map(item => ({
          ...item,
          // userSelectState: {
          //   isAnswered: false,
          //   // isRight: false,
          //   // userOption: 'B'
          // },
          // isCollected: false,
          // star: stars
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