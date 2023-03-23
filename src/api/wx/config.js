/*
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-06-09 13:32:44
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-23 18:42:57
 * @FilePath: /data-table/src/api/wx/config.js
 * @Description:
 */
import { fn, fetch } from '@/api/fn';

const Api = {
  WX_JSAPI: '/srv/?a=wx_share',
}

/**
 * @description 获取微信CONFIG配置文件
 * @param {*} url
 * @returns {*} cfg
 */
export const wxJsAPI = (params) => fn(fetch.get(Api.WX_JSAPI, params));
