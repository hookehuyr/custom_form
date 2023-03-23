/*
 * @Date: 2022-09-19 14:11:06
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-23 17:56:29
 * @FilePath: /custom_form/src/utils/request.js
 * @Description: 简单axios封装，后续按实际处理
 */

// var axios = '';
//   if (process.env.TARO_ENV === 'weapp') {
//     console.warn(0);
//     // axios = require("axios-miniprogram");
//     axios = import("axios-miniprogram");
//     console.warn(axios);
//   } else if (process.env.TARO_ENV === 'h5') {
//     // axios = require('axios')
//     console.warn(1);
//   }
// console.warn(await axios);
// import axios from 'axios'
// axios = await import('axios-miniprogram')
// import axios from 'axios-miniprogram';
import axios from 'axios'
import Taro from '@tarojs/taro'
import { routerStore } from '@/stores/router'
import { DEV_PROXY_TARGET, PROD_PROXY_TARGET, PROGRAM_PREFIX } from '../../config/env'

// import { ProgressStart, ProgressEnd } from '@/components/axios-progress/progress';
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// import BASE_URL from './config';
let BASE_URL = ''
if (process.env.NODE_ENV !== 'development') {
  BASE_URL = DEV_PROXY_TARGET // 测试服务器
} else {
  BASE_URL = PROD_PROXY_TARGET // 正式服务器
}

// create an axios instance
const service = axios.create({
  // 小程序跨域需要定义域名前缀，H5跨域有配置不需要
  baseURL: process.env.TARO_ENV === 'weapp' ? BASE_URL : '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

service.defaults.params = {
  f: PROGRAM_PREFIX,
}

// request interceptor
service.interceptors.request.use(
  config => {
    // console.warn(config)
    // console.warn(store)
    /**
     * POST PHP需要修改数据格式
     * 序列化POST请求时需要屏蔽上传相关接口，上传相关接口序列化后报错
     */
    // config.data = config.method === 'post' && !strExist(['a=upload', 'upload.qiniup.com'], config.url) ? qs.stringify(config.data) : config.data;
    return config
  },
  error => {
    // do something with request error
    console.error(error, 'err') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {

    // wx.hideLoading();
    // const res = response.data
    // // Toast.clear();
    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 100000) {
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     // Toast.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //     //     confirmButtonText: 'Re-Login',
    //     //     cancelButtonText: 'Cancel',
    //     //     type: 'warning'
    //     // }).then(() => {
    //     //     // store.dispatch('user/resetToken').then(() => {
    //     //     //     location.reload()
    //     //     // })
    //     // })
    //   } else {
    //     // Toast.fail({
    //     //   message: res.message,
    //     //   duration: 1.5 * 1000
    //     // })
    //     // Tips.error(res.message, false)
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
    if (response.data.code === 401) {
      /**
       * 未授权跳转登录页
       * 授权完成后 返回当前页面
       */
      setTimeout(() => {
        Taro.navigateTo({
          url: '../../pages/auth/index?url=' + routerStore().url
        });
      }, 1000);
    }
    return response
  },
  error => {
    // Toast.clear();
    console.error('err' + error) // for debug
    // Toast.fail({
    //   message: error.message,
    //   duration: 1.5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
