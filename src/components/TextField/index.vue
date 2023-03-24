<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-24 15:04:18
 * @FilePath: /custom_form/src/components/TextField/index.vue
 * @Description: 单行文本输入框(微信扫描功能)
-->
<template>
  <div v-if="HideShow" class="text-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div class="note-wrapper" v-if="item.component_props.note" v-html="item.component_props.note" />
    <nut-input v-model="item.value" :name="item.name" :type="item.type"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入'" :rules="item.rules"
      :required="item.required"
      :readonly="item.component_props.readonly || (item.component_props.is_camera_scan && !item.component_props.is_edit_camera_scan_result)"
      :disabled="item.component_props.disabled" :input-align="item.component_props.align"
      :right-icon="item.component_props.is_camera_scan ? 'scan' : ''" @click-right-icon="clickRightIcon" />
  </div>
</template>

<script setup>
import { getUrlParams } from "@/utils/tools";
import Taro from '@tarojs/taro'

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

// 默认识别类型
const scan_type_code = ref('ALL_CODE');
// 微信二维码扫描功能判断
const scanType = (scan_type_code) => {
  switch (scan_type_code) {
    case 'ALL_CODE':
      return ["qrCode", "barCode"]
    case 'QR_CODE':
      return ["qrCode"]
    case 'BAR_CODE':
      return ["barCode"]
  }
}

// 预览模式
const model = getUrlParams(location.href) ? getUrlParams(location.href).model : '';
const clickRightIcon = async () => {
  // 预览模式屏蔽微信功能
  if (model === 'preview') return false;
  Taro.ready(() => {
    Taro.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: scanType(props.item.camera_scan_type), // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        if (res.errMsg === 'scanQRCode:ok') {
          let code = res.resultStr;
          let code_arr = code.split(",");
          props.item.value = code_arr[1];
          Taro.showToast({
            title: '扫描成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.warn(res);
          Taro.showToast({
            title: '扫描失败',
            icon: 'error',
            duration: 2000
          })
        }
      },
      error: function (res) {
        if (res.errMsg.indexOf('function_not_exist') > 0) {
          alert('版本过低请升级')
        }
        alert(res.errMsg);
      },
    });
  });
}
</script>

<style lang="less" scoped>
.text-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }

    .note-wrapper {
      font-size: 0.9rem;
      margin-left: 1rem;
      color: gray;
      padding-bottom: 0.5rem;
      padding-top: 0.25rem;
      white-space: pre-wrap;
    }
  }
}

:deep(.van-field__body) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}
</style>
