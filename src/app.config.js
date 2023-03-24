/*
 * @Date: 2023-03-23 11:17:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-24 13:13:44
 * @FilePath: /custom_form/src/app.config.js
 * @Description: 文件描述
 */
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/table/index',
    'pages/auth/index',
    'pages/stop/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
