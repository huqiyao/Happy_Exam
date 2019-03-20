var app = getApp();
var globalData = app.globalData;

//index.js
//获取应用实例
// const app = getApp()
Page({
  // data: {
  //   filePath: '',
  //   loadResult: 'init'
  // },
  
  // pathInput: function(e) {
  //   this.setData({
  //     filePath: e.detail.value
  //   })
  // },

  // loadFile: function(e) {
  //   let that = this;

  //   // 从微信会话中选择文件
  //   wx.chooseMessageFile({
  //     count: 10,
  //     type: 'file',
  //     success(res) {
  //       const tempFiles = res.tempFiles;
  //       if (tempFiles.length > 0) {
  //         const filePath = tempFiles[0].path;
  //         console.log(filePath);

  //         // 读取文件
  //         wx.getFileSystemManager().readFile({
  //           filePath: filePath,
  //           encoding: 'utf8',
  //           success: function (res) {
  //             console.log(res.data);
  //             try {
  //               const library = JSON.parse(res.data);
  //               app.globalData.librarys.push(library);
  //               wx.setStorage({
  //                 key: 'librarys',
  //                 data: app.globalData.librarys,
  //                 success: function (res) {
  //                   console.log('保存题库数据成功！')
  //                 }
  //               });
  //               that.setData({
  //                 loadResult: JSON.stringify(app.globalData.librarys)
  //               })
  //             } catch(e) {
  //               console.log(JSON.stringify(e));
  //               that.setData({
  //                 loadResult: '解析题库失败'
  //               })
  //             }
  //           },
  //           fail: function (res) {
  //             console.log('读取文件失败！');
  //           },
  //         });
  //       }
  //     },
  //     fail(res) {
  //       console.log('读取文件失败！');
  //     }
  //   })
  // },

  // onLoad: function (options) {
    
  // }


  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    librarys: [],
    currentLibraryId: '',
    filePath: '',
    loadResult: 'init',
    isPopupMenu: false,
    popupLibId: '',
    popupX: 0,
    popupY: 0,
  },
  lower() {
    var result = this.data.res;

    var resArr = [];
    for (let i = 0; i < 10; i++) {
      resArr.push(i);
    };
    var cont = result.concat(resArr);
    console.log(resArr.length);
    if (cont.length >= 100) {
      wx.showToast({ //如果全部加载完成了也弹一个框
        title: '我也是有底线的',
        icon: 'success',
        duration: 300
      });
      return false;
    } else {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.setData({
          res: cont
        });
        wx.hideLoading();
      }, 1500)
    }
  },

  popupMenu: function(e) {
    console.log('长安');
    console.log(JSON.stringify(e));
    console.log(e.currentTarget.dataset.id);
    this.setData({
      isPopupMenu: true,
      popupLibId: e.currentTarget.dataset.id,
      popupX: e.detail.x,
      popupY: e.detail.y,
    })
  },

  closePopup: function() {
    this.setData({
      isPopupMenu: false,
    })
  },

  deleteLib: function() {
    app.globalData.librarys = app.globalData.librarys.filter(item => item.id !== this.data.popupLibId);
    wx.setStorage({
      key: 'librarys',
      data: app.globalData.librarys,
      success: function (res) {
        console.log('保存题库数据成功！')
      }
    });
    this.setData({
      librarys: app.globalData.librarys,
    })
  },

  loadFile: function(e) {
    let that = this;

    // 从微信会话中选择文件
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success(res) {
        const tempFiles = res.tempFiles;
        if (tempFiles.length > 0) {
          const filePath = tempFiles[0].path;
          console.log(filePath);

          // 读取文件
          wx.getFileSystemManager().readFile({
            filePath: filePath,
            encoding: 'utf8',
            success: function (res) {
              console.log(res.data);
              try {
                const library = JSON.parse(res.data);
                app.globalData.librarys.push(library);
                wx.setStorage({
                  key: 'librarys',
                  data: app.globalData.librarys,
                  success: function (res) {
                    console.log('保存题库数据成功！')
                  }
                });
                that.setData({
                  loadResult: JSON.stringify(app.globalData.librarys),
                  librarys: app.globalData.librarys,
                })
              } catch(e) {
                console.log(JSON.stringify(e));
                that.setData({
                  loadResult: '解析题库失败'
                })
              }
            },
            fail: function (res) {
              console.log('读取文件失败！');
            },
          });
        }
      },
      fail(res) {
        console.log('读取文件失败！');
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })

  },

  onShow: function () {
    this.setData({
      librarys: globalData.librarys,
      currentLibraryId: globalData.currentLibraryId
    })
  }
})

