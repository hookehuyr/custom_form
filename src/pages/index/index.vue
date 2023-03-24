<template>
  <view class="index">
    <nut-config-provider :theme-vars="themeVars">
      <nut-dialog no-cancel-btn title="温馨提示" content="表单收集量已达到限额，无法再提交数据。" v-model:visible="show_reach_sjsj_max_count" @ok="onOk" />
    </nut-config-provider>
  </view>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import Taro from '@tarojs/taro'
import { useDidShow } from '@tarojs/taro'
import request from '@/utils/request';
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores'
import { wxInfo, getUrlParams } from "@/utils/tools";
// 初始化WX环境
import wx from 'weixin-js-sdk'
import { wxJsAPI } from '@/api/wx/config'
import { apiList } from '@/api/wx/jsApiList.js'
import { styleColor } from "@/constant.js";
import { getFormSettingAPI } from "@/api/form.js";

// TAG: 自定义主题颜色
const themeVars = {
  primaryColor: styleColor.baseColor,
};

// web端判断
const is_pc = computed(() => process.env.TARO_ENV === 'h5' && wxInfo().isPC);

const store = mainStore();
const { formInfo } = storeToRefs(store);

const show_reach_sjsj_max_count = ref(false);
const onOk = () => {
  show_reach_sjsj_max_count.value = false;
}

onMounted(async () => {
  const code = getUrlParams(location.href) ? getUrlParams(location.href).code : '';
  const model = getUrlParams(location.href) ? getUrlParams(location.href).model : '';
  const raw_url = encodeURIComponent(location.pathname + location.hash);
  // 数据收集设置
  const { data } = await getFormSettingAPI({ form_code: code });
  const form_setting = {};
  if (data.length) {
    Object.assign(form_setting, data[0]['property_list'], data[0]['extend']);
  }
  // 缓存表单设置
  store.changeFormSetting(form_setting);
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
      // $router.replace({
      //   path: '/auth',
      //   query: {
      //     href: location.hash,
      //     code
      //   }
      // });
      Taro.redirectTo({
        url: `../auth/index?href=${location.hash}&code=${code}`
      })
    }
  } else {
    // 判断跳转页面
    if (form_setting.sjsj_enable === 0 && !form_setting.sjsj_enable) {
      // 表单已结束
      // $router.push("/stop?status=disable");
      Taro.navigateTo({
        url: '../stop/index?status=disable'
      })
    }
    // 开启后有开始和结束时间，不在时间范围的显示表单还未开始或者已经结束
    if (form_setting.sjsj_is_time_range && form_setting.sjsj_is_time_range) {
      // 未开始
      if (form_setting.server_time < form_setting.sjsj_begin_time) {
        // $router.push("/stop?status=apply");
        Taro.navigateTo({
          url: '../stop/index?status=apply'
        })
      }
      // 已结束
      if (form_setting.server_time > form_setting.sjsj_end_time) {
        // $router.push("/stop?status=finish");
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
      // showDialog({
      //   title: '温馨提示',
      //   message: '表单收集量已达到限额，无法再提交数据。',
      //   theme: 'round-button',
      //   confirmButtonColor: styleColor.baseColor
      // });
      show_reach_sjsj_max_count.value = true;
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
