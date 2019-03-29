const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const parseLibrary = str => {
  
}

const getOrderByIndex = index => {
  return String.fromCharCode(65 + index)
}

// var app = getApp();
// function getLibIndex() {
//   if (app.globalData.librarys != undefined){
//     for (var i = 0; i < app.globalData.librarys.length; i++) {
//       if (app.globalData.currentLibraryId === app.globalData.librarys[i].id) {
//         return i
//       }
//     }
//   }
//   else return undefined
// }

module.exports = {
  formatTime: formatTime,
  parseLibrary: parseLibrary,
  // getLibIndex: getLibIndex
}
