/*
 * @Date: 2023-03-23 11:17:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-23 15:55:13
 * @FilePath: /custom_form/babel.config.js
 * @Description: 文件描述
 */
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'vue3',
        ts: false,
        'dynamic-import-node': true,
      },
    ],
  ],
}
