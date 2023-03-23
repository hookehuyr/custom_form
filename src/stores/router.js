/*
 * @Date: 2022-10-28 14:34:22
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-01 13:27:09
 * @FilePath: /swx/src/stores/router.js
 * @Description: 缓存路由信息
 */
import { defineStore } from 'pinia'

export const routerStore = defineStore('router', {
  state: () => {
    return {
      url: '',
    }
  },
  actions: {
    add (path) {
      this.url = path
    },
    remove () {
      this.url = ''
    },
  },
})
