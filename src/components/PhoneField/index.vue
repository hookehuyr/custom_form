<!--
 * @Date: 2022-09-02 10:46:03
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-06 16:52:13
 * @FilePath: /custom_form/src/components/PhoneField/index.vue
 * @Description: 手机输入框
-->
<template>
  <div v-if="HideShow" class="phone-field-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <!-- <van-field
      :id="item.name"
      v-model="item.value"
      :name="item.name"
      type="digit"
      maxlength="11"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入手机号码'"
      :rules="rules"
      :required="item.component_props.required"
      :disabled="item.component_props.readonly"
      :readonly="readonly"
      @touchstart.stop="openKeyboard($event)"
      :border="false"
    > -->
    <nut-input
      :id="item.name"
      v-model="input_value"
      :label="item.name"
      type="digit"
      max-length="11"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入手机号码'"
      :disabled="item.component_props.readonly"
      :border="false"
      @blur="onBlur"
      style="border: 1px solid #eaeaea; border-radius: 0.25rem; padding: 0.25rem 0.5rem;"
    >
    </nut-input>
    <div
      v-if="show_error"
      style="padding-left: 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
    <!-- <van-field
      v-if="is_sms"
      name="ignore"
      v-model="sms"
      center
      clearable
      label=""
      placeholder="请输入短信验证码"
      :border="false"
    >
      <template #button>
        <van-button size="small" type="primary">发送验证码</van-button>
      </template>
    </van-field>
    <van-number-keyboard
      v-model="item.value"
      :show="show"
      :maxlength="11"
      @blur="blurKeyboard()"
      safe-area-inset-bottom
    /> -->
  </div>
</template>

<script setup>
import { wxInfo } from "@/utils/tools";
import Taro, { useLoad } from '@tarojs/taro'
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { $ } from '@tarojs/extend';
import { storeToRefs } from "pinia";
import { mainStore } from '@/stores'

const props = defineProps({
  item: Object,
});
const emit = defineEmits(["active"]);

// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

// web端判断
const readonly = computed(() => wxInfo().isMobile);
// 打开短信验证模式
const is_sms = ref(false);

const input_value = ref('');

const show_error = ref(false);
const error_msg = ref('');

// 错误提示文案
const validPhone = () => {
  if (props.item.component_props.required && !input_value.value) {
    show_error.value = true;
    error_msg.value = '必填项不能为空';
  } else if (input_value.value && !/1\d{10}/.test(input_value.value)) {
    show_error.value = true;
    error_msg.value = '请输入正确手机号码';
  } else {
    show_error.value = false;
    error_msg.value = '';
  }
  return !show_error.value;
};

defineExpose({ validPhone, id: props.item.key });

const onBlur = () => {
  // 发送自定义回调
  props.item.value = {
    key: "phone",
    filed_name: props.item.key,
    value: input_value.value,
  };
  emit("active", props.item.value);
  validPhone()
}

const show = ref(false);
let content = "";

const store = mainStore();
const { fieldName } = storeToRefs(store);

// 监听字段变化
// watch(
//   () => fieldName.value,
//   (v) => {
//     // 如果不是点击本输入框
//     if (v !== props.item.name) {
//       // 还原border颜色
//       $(`#${props.item.name}`).parent().css("border-color", "#eaeaea");
//       show.value = false;
//       document.getElementById("app").style.paddingBottom = "0";
//     }
//   }
// );

// const openKeyboard = (e) => {
//   if (props.item.component_props.readonly) return false; // 如果为只读，不能设置
//   // 键盘上移动
//   const target_to_view_height =
//     window.innerHeight - e.target.getBoundingClientRect().bottom; // 元素到适口高度
//   const target_top = document.body.scrollHeight - $(e.target).offset().top; // 元素到正文高度
//   let scroll_height = "";
//   if (target_to_view_height <= 250) {
//     document.getElementById("app").style.paddingBottom = "250px";
//     // 向上滚动位置
//     document.documentElement.scrollTop = $(e.target).offset().top - 244;
//   }
//   // 选中添加border颜色
//   content = $(e.target).parent();
//   // TAG: 自定义主题颜色
//   content.css("border-color", "#c2915f");
//   setTimeout(() => {
//     show.value = true;
//   }, 300);
//   // 记录点击field名
//   store.changeFieldName(props.item.name);
// };
// const blurKeyboard = () => {
//   show.value = false;
//   document.getElementById("app").style.paddingBottom = "0";
//   // 还原border颜色
//   content.css("border-color", "#eaeaea");
// };
</script>

<style lang="less">
.phone-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
    text {
      color: red;
    }
  }

  .nut-input {
    padding: 20px 25px;
  }

  // :deep(.van-field__body) {
  //   border: 1px solid #eaeaea;
  //   border-radius: 0.25rem;
  //   padding: 0.25rem 0.5rem;
  //   input {
  //     color: #323233;
  //   }
  // }
}
</style>
