/*
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-05-28 10:17:40
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-12-01 16:33:51
 * @FilePath: /data-table/src/utils/axios.js
 * @Description:
 */
import axios from 'axios';
import router from '@/router';
import qs from 'Qs'
import { strExist } from '@/utils/tools'
// import { parseQueryString } from '@/utils/tools'

axios.defaults.params = {
  f: 'custom_form',
};

/**
 * @description 请求拦截器
 */
axios.interceptors.request.use(
  config => {
    // const url_params = parseQueryString(location.href);
    // GET请求默认打上时间戳，避免从缓存中拿数据。
    const timestamp = config.method === 'get' ? (new Date()).valueOf() : '';
    /**
     * POST PHP需要修改数据格式
     * 序列化POST请求时需要屏蔽上传相关接口，上传相关接口序列化后报错
     */
    // config.data = config.method === 'post' && !strExist(['a=upload', 'upload.qiniup.com'], config.url) ? qs.stringify(config.data) : config.data;
    // 绑定默认请求头
    config.params = { ...config.params, timestamp }
    return config;
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  });

/**
 * @description 响应拦截器
 */
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  });

export default axios;
