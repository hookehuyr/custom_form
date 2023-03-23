/*
 * @Date: 2022-05-18 22:56:08
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-23 14:47:14
 * @FilePath: /custom_form/src/api/fn.js
 * @Description: 文件描述
 */
import axios from '@/utils/request'
import qs from 'Qs'
import Taro from '@tarojs/taro'

/**
 * 网络请求功能函数
 * @param {*} api 请求axios接口
 * @returns 请求成功后，获取数据
 */
export const fn = (api) => {
  return api
    .then(res => {
      if (res.data.code === 1) {
        return res.data || true;
      } else {
        // tslint:disable-next-line: no-console
        // if (!res.data.show) return false;
        Taro.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        });
        return false;
      }
    })
    .catch(err => {
      // tslint:disable-next-line: no-console
      console.error(err);
      return false;
    })
    .finally(() => { // 最终执行
    })
}

/**
 * 七牛返回格式
 * @param {*} api
 * @returns
 */
export const uploadFn = (api) => {
  return api
    .then(res => {
      if (res.status === 200) {
        return res.data || true;
      } else {
        // tslint:disable-next-line: no-console
        console.warn(res);
        if (!res.data.show) return false;
        Taro.showToast({
          title: res.data.msg,
          icon: 'close',
          duration: 2000,
        })
        return false;
      }
    })
    .catch(err => {
      // tslint:disable-next-line: no-console
      console.error(err);
      return false;
    })
}

/**
 * 统一 GET/POST 不同传参形式
 */
export const fetch = {
  get: function (api, params) {
    return axios.get(api, { params })
  },
  post: function (api, params) {
    return axios.post(api, params)
  },
  stringifyPost: function (api, params) {
    return axios.post(api, qs.stringify(params))
  },
  basePost: function (url, data, config) {
    return axios.post(url, data, config)
  }
}
