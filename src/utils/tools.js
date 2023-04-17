/*
 * @Date: 2022-04-18 15:59:42
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-04 10:21:01
 * @FilePath: /custom_form/src/utils/tools.js
 * @Description: 文件描述
 */
import dayjs from 'dayjs'

// 格式化时间
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

/**
 * @description 判断浏览器属于平台
 * @returns
 */
const wxInfo = () => {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
  let isMobile =
    u.indexOf('Android') > -1 ||
    u.indexOf('iPhone') > -1 ||
    u.indexOf('iPad') > -1 // 移动端平台
  let isIpad = u.indexOf('iPad') > -1 // iPad平台
  let uAgent = navigator.userAgent.toLowerCase()
  let isWeiXin =
    uAgent.match(/MicroMessenger/i) == 'micromessenger' ? true : false
  let isPC = uAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|micromessenger)/i,
  )
    ? false
    : true
  return {
    isAndroid,
    isiOS,
    isWeiXin,
    isMobile,
    isIpad,
    isPC,
  }
}

/**
 * @description 判断多行省略文本
 * @param {*} id 目标dom标签
 * @returns
 */
const hasEllipsis = (id) => {
  let oDiv = document.getElementById(id)
  let flag = false
  if (oDiv.scrollHeight > oDiv.clientHeight) {
    flag = true
  }
  return flag
}

/**
 * @description 解析URL参数
 * @param {*} url
 * @returns
 */
const parseQueryString = (url) => {
  var json = {}
  var arr =
    url.indexOf('?') >= 0 ? url.substr(url.indexOf('?') + 1).split('&') : []
  arr.forEach((item) => {
    var tmp = item.split('=')
    json[tmp[0]] = decodeURIComponent(tmp[1])
  })
  return json
}

/**
 * 字符串包含字符数组中字符的状态
 * @param {*} array 字符数组
 * @param {*} str 字符串
 * @returns 包含状态
 */
const strExist = (array, str) => {
  const exist = array.filter((arr) => {
    if (str.indexOf(arr) >= 0) return str
  })
  return exist.length > 0
}

/**
 * 自定义替换参数
 * @param {*} url
 * @param {*} arg
 * @param {*} arg_val
 * @returns
 */
const changeURLArg = (url, arg, arg_val) => {
  var pattern = arg + '=([^&]*)'
  var replaceText = arg + '=' + arg_val
  if (url.match(pattern)) {
    var tmp = '/(' + arg + '=)([^&]*)/gi'
    tmp = url.replace(eval(tmp), replaceText)
    return tmp
  } else {
    if (url.match('[?]')) {
      return url + '&' + replaceText
    } else {
      return url + '?' + replaceText
    }
  }
  return url + '\n' + arg + '\n' + arg_val
}

// 获取参数key/value值对
const getUrlParams = (url) => {
  // 没有参数处理
  if (url.split('?').length === 1) return false
  let arr = url.split('?')
  let res = arr[1].split('&')
  let items = {}
  for (let i = 0; i < res.length; i++) {
    let [key, value] = res[i].split('=')
    items[key] = value
  }
  return items
}

// 格式化URL参数为字符串
const stringifyQuery = (params) => {
  const queryString = []
  Object.keys(params || {}).forEach((k) => {
    queryString.push(k + '=' + params[k])
  })

  return '?' + queryString.join('&')
}

// 深克隆
const deepClone = (val) => {
  if (val.constructor == Object) {
    let obj = {},
      keys = Object.keys(val)
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = deepClone(val[keys[i]])
    }
    return obj
  } else if (Array.isArray(val)) {
    return [].concat(val)
  } else {
    return val
  }
}

// 获取交集
const intersection = () => {
  const arrays = Array.prototype.slice.call(arguments); // 将参数转换为数组
  const result = [];

  if (arrays.length === 0) { // 如果没有参数，则返回空数组
    return result;
  }

  const firstArray = arrays[0];
  for (let i = 0; i < firstArray.length; i++) {
    const currentElement = firstArray[i];
    if (result.includes(currentElement)) { // 如果当前元素已经在结果中，则跳过
      continue;
    }

    let foundInAllArrays = true;
    for (let j = 1; j < arrays.length; j++) {
      const currentArray = arrays[j];
      if (!currentArray.includes(currentElement)) { // 如果当前元素不在其中一个数组中，则跳过
        foundInAllArrays = false;
        break;
      }
    }

    if (foundInAllArrays) { // 如果当前元素在所有数组中都存在，则添加到结果中
      result.push(currentElement);
    }
  }

  return result;
}

export {
  formatDate,
  wxInfo,
  hasEllipsis,
  parseQueryString,
  strExist,
  changeURLArg,
  getUrlParams,
  stringifyQuery,
  deepClone,
  intersection,
}
