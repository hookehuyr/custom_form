/*
 * @Date: 2023-03-23 11:17:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-24 16:04:21
 * @FilePath: /custom_form/src/app.js
 * @Description: 文件描述
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.less'
import { mainStore } from '@/stores'
import { getFormSettingAPI } from '@/api/form.js'
import { getUrlParams } from '@/utils/tools'

const App = createApp({
  // 可以使用所有的 Vue 生命周期方法
  async mounted() {
    if (process.env.TARO_ENV === 'h5') {
      const code = getUrlParams(location.href)
        ? getUrlParams(location.href).code
        : ''
      const store = mainStore();
      // 数据收集设置
      const { data } = await getFormSettingAPI({ form_code: code });
      const form_setting = {};
      if (data.length) {
        Object.assign(form_setting, data[0]['property_list'], data[0]['extend']);
      }
      // 缓存表单设置
      store.changeFormSetting(form_setting);
    }
  },

  // 对应 onLaunch
  onLaunch(options) {
    // // 未授权状态跳转授权页面，首页不需要权限
    // const path = options.path;
    // // 缓存没有权限的地址
    // const router = routerStore();
    // router.add(path);
    // if (path !== 'pages/index/index' && !wx.getStorageSync("sessionid")) {
    //   wx.navigateTo({
    //     url: './pages/auth/index'
    //   })
    // }
  },

  // 对应 onShow
  onShow(options) {
  },

  // 对应 onHide
  onHide() { },

  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

export default App
