/*
 * @Date: 2023-03-23 11:17:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-24 10:59:28
 * @FilePath: /custom_form/config/index.js
 * @Description: 文件描述
 */
const path = require('path')

import ComponentsPlugin from 'unplugin-vue-components/webpack'
import NutUIResolver from '@nutui/nutui-taro/dist/resolver'

const pluginOptions = {
  less: {
    patterns: [path.resolve(__dirname, '..', 'src/assets/styles/base.less')],
  },
}

const config = {
  projectName: 'custom_form',
  date: '2023-3-23',
  designWidth(input) {
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375
    }
    return 750
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  alias: {
    // 配置目录别名
    '@': path.resolve(__dirname, '../src'),
    '@/utils': path.resolve(__dirname, '../src/utils'),
    '@/components': path.resolve(__dirname, '../src/components'),
    '@/images': path.resolve(__dirname, '../src/assets/images'),
    '@/assets': path.resolve(__dirname, '../src/assets'),
    '@/composables': path.resolve(__dirname, '../src/composables'),
    '@/api': path.resolve(__dirname, '../src/api'),
    '@/stores': path.resolve(__dirname, '../src/stores'),
    '@/hooks': path.resolve(__dirname, '../src/hooks'),
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [
    '@tarojs/plugin-html',
    [
      '@tarojs/plugin-http',
      {
        disabledFormData: false,
        disabledBlob: false,
        enableCookie: true,
      },
    ],
    ['taro-plugin-style-resource', pluginOptions],
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },
  mini: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        ComponentsPlugin({
          resolvers: [NutUIResolver({ taro: true })],
        }),
      )
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    enableSourceMap: false,
  },
  h5: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        ComponentsPlugin({
          resolvers: [NutUIResolver({ taro: true })],
        }),
      )
    },
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-taro', 'icons-vue-taro'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
