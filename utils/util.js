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

/**
 * 产生任意长度随机字母数字组合
 * @param  {Boolean} randomFlag 是否任意长度
 * @param  {Number} min        任意长度最小位[固定位数]
 * @param  {Number} max        任意长度最大位
 * @return {String}            随机字符串
 */
const randomWord = (randomFlag, min, max) => {
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }

  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }

  return str;
}
// 倒计时的封装
function dayTimeArr(bb) {
  var bb = bb
  var day = parseInt(bb / 86400);
  var time = parseInt((bb - (day * 86400)) / 3600);
  var min = parseInt((bb - (time * 3600 + day * 86400)) / 60)
  var sinTime = time * 3600 + min * 60 + day * 86400
  var sinTimeb;
  var sin1 = parseInt((bb - sinTime))
  var timeArr = [addEge(day), addEge(time), addEge(min), addEge(sin1)];
  if (bb <= 0) {
    timeArr = ["00", "00", "00", "00"];
  }
  return timeArr
}
function addEge(a) {
  return a < 10 ? a = "0" + a : a = a
}
function sum(arr) {
  var s = 0;
  for (var i = arr.length - 1; i >= 0; i--) {
    s += arr[i];
  }
  return s;
}
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}
module.exports = {
  sum,
  dayTimeArr: dayTimeArr,
  addEge: addEge,
  formatTime: formatTime,
  randomWord: randomWord,
  getCurrentPageUrl: getCurrentPageUrl
}