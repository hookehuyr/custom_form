<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-03 13:17:42
 * @FilePath: /custom_form/src/components/TextField/index.vue
 * @Description: 单行文本输入框(微信扫描功能)
-->
<template>
  <div v-if="HideShow" class="text-field-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <!-- <div class="note-wrapper" v-if="item.component_props.note" v-html="item.component_props.note" /> -->
    <nut-form-item :required="item.required">
      <nut-input
        v-model="input_value"
        :type="item.type"
        :border="false"
        :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入'"
        :readonly="item.component_props.readonly || (item.component_props.is_camera_scan && !item.component_props.is_edit_camera_scan_result)"
        :disabled="item.component_props.disabled"
        :input-align="item.component_props.align"
          style="border: 1px solid #eaeaea; border-radius: 0.25rem; padding: 0.25rem 0.5rem;"
        >
          <template #right v-if="item.component_props.is_camera_scan"><Scan @click="clickRightIcon()"></Scan></template>
        </nut-input>
        <div
          v-if="show_error"
          style="padding: 5px; color: red; font-size: 12px;"
        >
          {{ error_msg }}
        </div>
    </nut-form-item>
  </div>
</template>

<script setup>
import { getUrlParams } from "@/utils/tools";
import Taro from '@tarojs/taro'
import { ref, computed, watch, onMounted, reactive } from "vue";
import { Scan } from '@nutui/icons-vue-taro';
// 初始化WX环境
import wx from 'weixin-js-sdk'

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const emit = defineEmits(["active"]);
const input_value = ref('');

// 错误提示
const show_error = ref(false);
const error_msg = ref('');

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
const clickRightIcon = () => {
  // 预览模式屏蔽微信功能
  if (model === 'preview') return false;
  if (process.env.TARO_ENV === 'h5') {
    wx.ready(() => {
      wx.scanQRCode({
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
  if (process.env.TARO_ENV === 'weapp') {
    Taro.scanCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: scanType(props.item.camera_scan_type), // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        if (res.errMsg === 'scanCode:ok') {
          let code = res.result;
          input_value.value = code;
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
  }
}

// watch(
//   () => input_value.value,
//   (newValue, oldValue) => {
//     console.warn(newValue);
//     // props.item.value = {
//     //   key: "input",
//     //   filed_name: props.item.key,
//     //   value: newValue,
//     // };
//     // emit("active", props.item.value);
//   },
//   { immediate: true }
// );

onMounted(() => {
})
const changeInput = (val) => {
  // props.item.value = {
  //   key: "input",
  //   filed_name: props.item.key,
  //   value: val,
  // };
  // emit("active", props.item.value);
  // validInput();
}

// 校验模块
const validInput = () => {
  // 必填项
  if (props.item.component_props.required && !input_value.value) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else {
    show_error.value = false;
    error_msg.value = ''
  }
  return !show_error.value;
};

defineExpose({ validInput });
</script>

<style lang="less">
.text-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;

    text {
      color: red;
    }

    .note-wrapper {
      font-size: 24px;
      margin-left: 30px;
      color: gray;
      padding-bottom: 15px;
      padding-top: 7px;
      white-space: pre-wrap;
    }
  }
}

// :deep(.nut-input) {
//   border: 1px solid #eaeaea;
//   border-radius: 0.25rem;
//   padding: 0.25rem 0.5rem;
// }

// .nut-input--border  {
//   border: 1px solid #eaeaea;
//   border-radius: 7px;
//   padding: 7px 14px !important;
// }


input {
  color: #000 !important;
}
</style>
