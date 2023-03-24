/*
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-05-28 22:31:25
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-05-30 10:18:09
 * @FilePath: /tswj/src/hooks/useDebounce.js
 * @Description: 
 */
import _ from 'lodash';
/**
 * 封装lodash防抖
 * @param {*} fn 执行函数
 * @param {*} timestamp 执行间隔
 * @param {*} options 函数配置 - 在延迟开始前调用，在延迟结束后不调用
 * @returns 返回新的 debounced（防抖动）函数。
 */
export const useDebounce = (fn, timestamp = 500, options = { leading: true, trailing: false }) => {
  return _.debounce(fn, timestamp, options);
}
