import { createProxy } from './proxy'
import { DEV_PROXY_TARGET, PROXY_PREFIX } from './env'

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    target: 'web',
    // 配置代理，解决跨域问题
    devServer: {
      port: '10086', // 设置端口号
      // https: true, //是否使用https协议
      open: false, //启动后，使用默认浏览器打开网页
      hot: true, //是否启用模块的热替换功能，devServer的默认行为是在发现源代码被变更后，通过自动刷新整个页面来做到事实预览，开启hot后，将在不刷新整个页面的情况下通过新模块替换老模块来做到实时预览。
      proxy: createProxy(PROXY_PREFIX, DEV_PROXY_TARGET),
    },
  },
}
