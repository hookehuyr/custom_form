/*
 * @Date: 2022-06-17 14:54:29
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-17 13:49:35
 * @FilePath: /data-table/src/api/data.js
 * @Description: 表单数据接口
 */
import { fn, fetch } from '@/api/fn';

const Api = {
  ADD_FORM_DATA: '/srv/?a=add_formdata',
}
/**
 * @description: 添加表单数据
 * @param: form_code 表单唯一标识
 * @param: data 待添加的数据，json对象结构；键值对记录变更的字段和值；
 */
export const addFormDataAPI = (params) => fn(fetch.post(Api.ADD_FORM_DATA, params));
