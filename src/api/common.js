/*
 * @Date: 2022-06-17 14:54:29
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-12-01 16:26:27
 * @FilePath: /data-table/src/api/common.js
 * @Description: 通用接口
 */
import { fn, fetch, uploadFn } from '@/api/fn';

const Api = {
  SMS: '/srv/?a=sms',
  TOKEN: '/srv/?a=upload',
  SAVE_FILE: '/srv/?a=upload&t=save_file',
}

/**
 * @description: 发送验证码
 * @param {*} phone 手机号码
 * @returns
 */
export const smsAPI = (params) => fn(fetch.post(Api.SMS, params));

/**
 * @description: 获取七牛token
 * @returns
 */
export const qiniuTokenAPI = (params) => fn(fetch.stringifyPost(Api.TOKEN, params));

/**
 * @description: 上传七牛
 * @param {*}
 * @returns
 */
export const qiniuUploadAPI = (url, data, config) => uploadFn(fetch.basePost(url, data, config));

/**
 * @description: 保存图片
 * @param {*} format
 * @param {*} hash
 * @param {*} height
 * @param {*} width
 * @param {*} filekey
 * @returns
 */
export const saveFileAPI = (params) => fn(fetch.stringifyPost(Api.SAVE_FILE, params));
