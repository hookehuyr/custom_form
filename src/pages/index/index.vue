<template>
  <view class="index-page">
    <nut-config-provider :theme-vars="themeVars">
      <nut-dialog no-cancel-btn title="温馨提示" content="表单收集量已达到限额，无法再提交数据。" v-model:visible="show_reach_sjsj_max_count" @ok="onOk" />
    </nut-config-provider>
  </view>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import { wxInfo, getUrlParams } from "@/utils/tools";
// 初始化WX环境
import wx from 'weixin-js-sdk'
import { wxJsAPI } from '@/api/wx/config'
import { apiList } from '@/api/wx/jsApiList.js'
import { styleColor } from "@/constant.js";
import { mainStore } from '@/stores'
import { getFormSettingAPI } from '@/api/form.js'
import Taro, { useReady } from '@tarojs/taro'

// TAG: 自定义主题颜色
const themeVars = {
  primaryColor: styleColor.baseColor,
};

const code = getUrlParams(location.href) ? getUrlParams(location.href).code : '';
const model = getUrlParams(location.href) ? getUrlParams(location.href).model : '';

const show_reach_sjsj_max_count = ref(false);

const onOk = () => {
  show_reach_sjsj_max_count.value = false;
  Taro.redirectTo({
    url: `../table/index?code=${code}&model=${model}`
  })
}

onMounted(async () => {
  const store = mainStore();
  // 数据收集设置
  const { data } = await getFormSettingAPI({ form_code: code });
  const form_setting = {};
  if (data.length) {
    Object.assign(form_setting, data[0]['property_list'], data[0]['extend']);
  }
  // 缓存表单设置
  store.changeFormSetting(form_setting);

  const raw_url = encodeURIComponent(location.pathname + location.hash);
  // 没有授权判断
  const no_auth_info = form_setting.wxzq_enable && !form_setting.x_field_weixin_openid;
  const no_preview_model = model !== 'preview';
  // 需要网页授权-必须要域名相同，需要上传到线上测试
  /**
   * 微信公众号授权模式
   * 空字符串=不授权，snsapi_base=静默授权，snsapi_userinfo=显式授权
   */
  // 非测试环境，没有授权信息，需要授权
  if (process.env.NODE_ENV !== 'development' && no_auth_info && form_setting.wxzq_scope) {
    // 预览模式不开启
    if (no_preview_model) {
      Taro.redirectTo({
        url: `../auth/index?href=${location.hash}&code=${code}`
      })
    }
  } else {
    // 判断跳转页面
    if (form_setting.sjsj_enable === 0 && !form_setting.sjsj_enable) {
      // 表单已结束
      Taro.navigateTo({
        url: '../stop/index?status=disable'
      })
    }
    // 开启后有开始和结束时间，不在时间范围的显示表单还未开始或者已经结束
    if (form_setting.sjsj_is_time_range && form_setting.sjsj_is_time_range) {
      // 未开始
      if (form_setting.server_time < form_setting.sjsj_begin_time) {
        Taro.navigateTo({
          url: '../stop/index?status=apply'
        })
      }
      // 已结束
      if (form_setting.server_time > form_setting.sjsj_end_time) {
        Taro.navigateTo({
          url: '../stop/index?status=finish'
        })
      }
    }
    // 启用分享功能，非预览模式
    if (form_setting.wxzq_is_share && no_preview_model) {
      const wxJs = await wxJsAPI({ form_code: code, url: raw_url });
      wxJs.data.jsApiList = apiList;
      wx.config(wxJs.data);
      wx.ready(() => {
        wx.showAllNonBaseMenuItem();
      });
      wx.error((err) => {
        console.warn(err);
      });
    }
    // 当数据量达到限额时，该表单将不能继续提交数据。
    if (form_setting.is_reach_sjsj_max_count) {
      show_reach_sjsj_max_count.value = true;
      return false;
    }
    // 设定填写次数
    if (form_setting.wxzq_scope && no_preview_model) {

    }
  }
  // 获取信息后重定向到表单页
  Taro.redirectTo({
    url: `../table/index?code=${code}&model=${model}`
  })
});

// 对应 onReady
useReady(() => {
  if (!Taro.canIUse('getUpdateManager')) {
    Taro.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
      showCancel: false,
    })
    return
  }

  // https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.html
  const updateManager = Taro.getUpdateManager()

  updateManager.onCheckForUpdate((res) => {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function () {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          },
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        Taro.showModal({
          title: '更新提示',
          content: '新版本已上线，请删除当前小程序，重新搜索打开',
        })
      })
    }
  })
})

</script>

<style lang="less">
@prefix: ~"@{namespace}-x";

html,
body {
  width: 100%;
  // height: 100%;
  color: @base-font-color;
  // background-color: #f7f8fa;
  // background-color: #fff9ef;
  padding: 0;
  margin: 0;
}

body {
  position: relative;

  p {
    margin: 0;
    padding: 0;
  }
}

#app {
  min-height: calc(100vh);
  position: relative;
}

.@{prefix} {
  color: red;
}

.global-center {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.zIndex {
  z-index: 4500 !important;
}
</style>
