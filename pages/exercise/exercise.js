var app = getApp();
var globalData = app.globalData;
var util 

// pages/exercise/exercise.js
const stars = [{
    flag: 0,
    imgUrl: "http://wximg.youtasc.com/star.png",
    markedImgUrl: "http://wximg.youtasc.com/f_star.png"
  },
  {
    flag: 0,
    imgUrl: "http://wximg.youtasc.com/star.png",
    markedImgUrl: "http://wximg.youtasc.com/f_star.png"
  },
  {
    flag: 0,
    imgUrl: "http://wximg.youtasc.com/star.png",
    markedImgUrl: "http://wximg.youtasc.com/f_star.png"
  },
  {
    flag: 0,
    imgUrl: "http://wximg.youtasc.com/star.png",
    markedImgUrl: "http://wximg.youtasc.com/f_star.png"
  },
  {
    flag: 0,
    imgUrl: "http://wximg.youtasc.com/star.png",
    markedImgUrl: "http://wximg.youtasc.com/f_star.png"
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isExerciseMode: true, //预设当前项的值
    // exerciseType: null
    // allen 该数据直接从全局里面取出来,需要先到题库tab页中读取json文件
    // subject: [{
    //   id: '1',
    //   desc: '程序流程图中带有箭头的线段表示的是',
    //   answers: [{
    //     order: 'A',
    //     value: '图元关系'
    //   },
    //   {
    //     order: 'B',
    //     value: '数据流'
    //   },
    //   {
    //     order: 'C',
    //     value: '控制流'
    //   },
    //   {
    //     order: 'D',
    //     value: '调用关系'
    //   }
    //   ],
    //   rightAnswerIndex: 2,
    //   analysis: '在数据流图中，用标有名字的箭头表示数据流。在程序流程图中，用标有名字的箭头表示控制流',
    //   imageUrl: null,
    //   userSelectState: {
    //     isAnswered: false,
    //     // isRight: false,
    //     // userOption: 'B'
    //   },
    //   collection: false,
    //   star: stars
    // },
    // {
    //   id: '2',
    //   desc: '有三个关系R、S和T如下:由关系R和S通过运算得到关系T，则所使用的运算为:',
    //   answers: [{
    //     order: 'A',
    //     value: '并'
    //   },
    //   {
    //     order: 'B',
    //     value: '自然连接'
    //   },
    //   {
    //     order: 'C',
    //     value: '笛卡尔积'
    //   },
    //   {
    //     order: 'D',
    //     value: '交'
    //   }
    //   ],
    //   rightAnswerIndex: 3,
    //   analysis: '根据关系T可明显看出是从关系R和关系S中取得相同的关系组所以取得的是交运算',
    //   imageUrl: "../../images/pic1.png",
    //   userSelectState: {
    //     isAnswered: false,
    //     // isRight: false,
    //     // userOption: 'B'
    //   },
    //   collection: false,
    //   star: stars
    // }
    // ]

    settingItems: [
      { name: 'autoSwitch', value: '答对自动切题' },
      { name: 'filterDislike', value: '过滤被屏蔽的题目', checked: 'true' },
    ],

    isCollected: false,
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

  clickCollect: function(e) {
    this.setData({
      isCollected: !this.data.isCollected,
    })
  },

  clickDislike: function (e) {
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
    var itemIndex = e.target.dataset.index
    var result = this.data.subject[itemIndex].rightAnswerIndex
    var choise = e.target.dataset.select
    if (this.data.subject[itemIndex].userSelectState.isAnswered === true || !this.data.isExerciseMode) {
      //  加上!this.data.isExerciseMode，否则背题模式下的选择会显示在答题模式下
      return;
    }
    var resultObject = {
      isAnswered: true,
      isRight: result === choise,
      userSelectIndex: choise
    }
    var userSelectState = "subject[" + itemIndex + "].userSelectState"; //先用一个变量，把(subject[itemIndex]. userSelectState)用字符串拼接起来,//第一次出错是因为字符串中无端出现空格
    var answers = "subject[" + itemIndex + "].answers";

    // 答对自动切换到下一题
    var swiperCurrent = this.data.swiperCurrent;
    if (resultObject.isRight) {
      console.log(swiperCurrent);
      swiperCurrent = swiperCurrent < (this.data.subject.length - 1) ? swiperCurrent + 1 : 0;
    }

    this.setData({
      [userSelectState]: resultObject,
      [answers]: this.data.subject[itemIndex].answers.map((answer, index) => {
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
    console.log(this.data.subject[itemIndex].userSelectState)
    // console.log(globalData.currentExerciseType)
  },

  confirmAnswer2: function(e) {

  },

  /**
   * 给题目评价打星
   */
  markIt: function(e) {
    var starIndex = e.target.dataset.select;
    var itemIndex = e.target.dataset.index;
    var starFlag = this.data.subject[itemIndex].star[starIndex].flag
    console.log(starIndex)
    console.log(itemIndex)
    console.log(starFlag)
    if (starFlag === 0) {
      for (var i = 0; i <= starIndex; i++) {
        var thisFlag = "subject[" + itemIndex + "].star[" + i + "].flag"
        this.setData({
          [thisFlag]: 1
        })
      }
    } else {
      for (var j = starIndex + 1; j <= 5; j++) {
        var thisFlag = "subject[" + itemIndex + "].star[" + j + "].flag"
        this.setData({
          [thisFlag]: 0
        })
      }
    }
  },
  /**
   * 收藏题目
   */
  collectIt: function(e) {
    var itemIndex = e.target.dataset.index;
    var isCollected = this.data.subject[itemIndex].collection
    console.log(itemIndex)
    console.log(isCollected)
    var thisCollection = "subject[" + itemIndex + "].collection"
    if (isCollected === false) {
      this.setData({
        [thisCollection]: true
      })
      //修改全局变量的值
      var collectedSubject = globalData.collectedSubjectIds;
      if (collectedSubject.indexOf(itemIndex) == -1) {
        collectedSubject.push(itemIndex)
      }
      console.log(isCollected)
      console.log(collectedSubject)
    } else {
      this.setData({
        [thisCollection]: false
      })
      console.log(isCollected)
    }

    wx.showToast({
      title: isCollected ? '已取消收藏' : '收藏成功',
      duration: 1000,
      icon: "success",
      mask: true
    })
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
  imageLoad: function (e) {
    var width = e.detail.width;    //获取图片真实宽度
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
    var index = event.currentTarget.dataset.index;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
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
    var that = this
    that.setData({
      currentExerciseType: options.currentExerciseType
    })
    // console.log(globalData.currentExerciseType)
    // this.setData({
    //   currentExerciseType: globalData.currentExerciseType
    // })

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
          userSelectState: {
            isAnswered: false,
            // isRight: false,
            // userOption: 'B'
          },
          collection: false,
          star: stars
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