/*
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-05-17 12:13:13
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-07-19 10:33:36
 * @FilePath: /front/src/composables/index.js
 * @Description:
 */
import { onMounted, onUnmounted } from 'vue'

/**
 * 添加和清除 DOM 事件监听器
 * @param {*} target 
 * @param {*} event 
 * @param {*} callback 
 */
export function useEventListener(target, event, callback) {
  onMounted(() => target?.addEventListener(event, callback))
  onUnmounted(() => target?.removeEventListener(event, callback))
}
