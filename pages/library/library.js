var app = getApp();

//index.js
//获取应用实例
// const app = getApp()
Page({
  data: {
    filePath: '',
    loadResult: 'init'
  },
  
  pathInput: function(e) {
    this.setData({
      filePath: e.detail.value
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
                  loadResult: JSON.stringify(app.globalData.librarys)
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

  onLoad: function (options) {
    
  }
})

