/*
 * @Date: 2022-06-17 14:54:29
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-17 13:46:01
 * @FilePath: /data-table/src/api/index.js
 * @Description: 首页接口
 */
import { fn, fetch } from '@/api/fn';

const Api = {
  INDEX: '/srv/?a=home_page',
}
/**
 * @description: 首页接口
 * @returns HOMEBANNER 轮播区
 * @returns HOMEZIXUN 观宗资讯
 * @returns HOMEVIDEO 视频展示
 * @returns HOMEKAISHI 本源法师开示
 * @returns spec_list 专题报告
 */
export const indexAPI = (params) => fn(fetch.get(Api.INDEX, params));
