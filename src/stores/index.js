/*
 * @Date: 2022-04-18 15:59:42
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-04 18:07:56
 * @FilePath: /custom_form/src/stores/index.js
 * @Description: 文件描述
 */
import { defineStore } from 'pinia';
// import { testStore } from './test'; // 另一个store

export const mainStore = defineStore('main', {
  state: () => {
    return {
      fieldName: '',
      callIndex: false, // 是否访问过index页面
      formInfo: {}, // 表单字段信息
      formSetting: {}, // 表单数据收集设置
      successInfo: {}, // 表单提交返回值
    }
  },
  getters: {
    getKeepPages() {
      return this.keepPages
    },
    // getTestStoreList () {
    //   return testStore().list // 返回另一个store的值
    // }
  },
  actions: {
    changeFieldName(v) {
      this.fieldName = v
    },
    changeCallIndex(v) {
      this.callIndex = v
    },
    changeFormInfo(v) {
      this.formInfo = v
    },
    changeFormSetting(v) {
      this.formSetting = v
    },
    changeSuccessInfo(v) {
      this.successInfo = v
    },
  },
})
