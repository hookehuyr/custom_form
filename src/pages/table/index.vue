<!--
 * @Date: 2023-03-24 09:19:27
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-24 14:21:47
 * @FilePath: /custom_form/src/pages/table/index.vue
 * @Description: 文件描述
-->
<template>
  <div class="">table</div>
</template>

<script setup>
import wx from 'weixin-js-sdk'
import { ref, computed } from 'vue'
import _ from "@/utils/lodash";
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores'
import { queryFormAPI, postVerifyPasswordAPI } from "@/api/form.js";
import { addFormDataAPI } from "@/api/data.js";
import { wxInfo, getUrlParams } from "@/utils/tools";
import { styleColor } from "@/constant.js";
import { sharePage } from '@/composables/useShare.js'

// // 获取表单设置
const store = mainStore();
const { formSetting, formInfo } = storeToRefs(store);
// web端判断封面图片高度
const is_pc = computed(() => process.env.TARO_ENV === 'h5' && wxInfo().isPC);
const PHeaderHeight = computed(() => {
  if (is_pc.value) {
    return "35vh";
  } else {
    return "20vh";
  }
});
// TAG: 自定义主题颜色
const themeVars = {
  buttonPrimaryBackground: styleColor.baseColor,
  buttonPrimaryBorderColor: styleColor.baseColor,
};
</script>

<style lang="less" scoped>

</style>
