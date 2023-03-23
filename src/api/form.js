/*
 * @Date: 2022-06-17 14:54:29
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-07 13:23:19
 * @FilePath: /data-table/src/api/form.js
 * @Description: 表单接口
 */
import { fn, fetch } from '@/api/fn';

const Api = {
  FORM_ADD: '/srv/?a=add_form',
  FORM_QUERY: '/srv/?a=query_form_all_field',
  ADD_FORM_FIELD: '/srv/?a=add_form_field',
  ADD_FORM_SETTING: '/srv/?a=add_form_setting',
  QUERY_FORM_SETTING: '/srv/?a=query_form_setting',
  VERIFY_PASSWORD: '/srv/?a=verify_password',
};

/**
 * @description: 新增表单
 * @param: client_id 主体客户id
 * @param: name 表单名称
 * @param: note 表单描述
 */
export const addFormAPI = (params) => fn(fetch.post(Api.FORM_ADD, params));

/**
 * @description: 查询表单
 * @param: client_id 主体客户id
 * @param: form_code 表单唯一标识
 * @param: name 表单名称，模糊查询
 */
export const queryFormAPI = (params) => fn(fetch.get(Api.FORM_QUERY, params));

/**
 * @description: 添加表单字段
 * @param: form_code 表单唯一标识
 * @param: component_code 组件标识
 */
export const addFormFieldAPI = (params) => fn(fetch.post(Api.ADD_FORM_FIELD, params));

/**
 * @description: 添加或修改表单字段属性设置
 * @param: form_code 表单唯一标识
 * @param: field_name 表单字段名。如果设置表单级（非字段级）的属性，可为空。
 * @param: component_code 组件标识
 * @param: property_code 属性标识
 * @param: setting_value 待设置的属性值。json数组，内部必须双引号。如果属性值是单值，数组只有一个元素。
 */
export const addFormSettingAPI = (params) => fn(fetch.post(Api.ADD_FORM_SETTING, params));

/**
 * @description: 查询表单的设置类组件的属性值
 * @param: form_code 表单唯一标识
 * @returns: enable 开启/停止表单 0=停止表单，1=开启表单
 * @returns: is_time_range 是否设定开启/停止时间 0=不设定，1=设定
 * @returns: is_count_down 是否显示停止倒计时 0=不显示，1-显示
 * @returns: begin_time 开启时间
 * @returns: end_time 停止时间
 */
export const getFormSettingAPI = (params) => fn(fetch.get(Api.QUERY_FORM_SETTING, params));

/**
 * @description: 验证便当密码
 * @param: form_code 表单唯一标识
 * @param: mmtx_password 用户输入的密码
 * @returns:
 */
export const postVerifyPasswordAPI = (params) => fn(fetch.post(Api.VERIFY_PASSWORD, params));
