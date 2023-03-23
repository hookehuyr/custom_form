/*
 * @Date: 2022-06-17 14:54:29
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-17 16:00:04
 * @FilePath: /data-table/src/api/component.js
 * @Description: 组件接口
 */
import { fn, fetch } from '@/api/fn';

const Api = {
  QUERY_COMPONENT: '/srv/?a=query_component',
}

/**
 * @description: 查询组件
 * @param: group_code 分组标识
 * @param: component_code 组件标识
 * @param: name 组件名称；条件：模糊查询；
 */
export const getComponentAPI = (params) => fn(fetch.get(Api.QUERY_COMPONENT, params));
