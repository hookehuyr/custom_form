/*
 * @Date: 2023-03-23 11:17:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-23 13:47:12
 * @FilePath: /custom_form/src/app.js
 * @Description: 文件描述
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.less'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

export default App
