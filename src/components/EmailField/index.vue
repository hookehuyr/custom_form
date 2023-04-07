<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-07 15:48:50
 * @FilePath: /custom_form/src/components/EmailField/index.vue
 * @Description: 邮箱输入框
-->
<template>
  <div v-if="HideShow" class="email-field-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <nut-input
      v-model="input_value"
      :name="item.name"
      type="email"
      :placeholder="item.component_props.placeholder"
      :disabled="item.component_props.disabled"
      :readonly="item.component_props.readonly"
      clearable
      :border="false"
      @blur="onBlur"
      style="border: 1px solid #eaeaea; border-radius: 0.25rem; padding: 0.25rem 0.5rem;"
    />
    <div
      v-if="show_error"
      style="padding-left: 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";

const props = defineProps({
  item: Object,
});

// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const onBlur = () => {
  // 发送自定义回调数字
  props.item.value = {
    key: "email",
    filed_name: props.item.key,
    value: input_value.value,
  };
  emit("active", props.item.value);
  validEmail()
}

const required = props.item.component_props.required;
const emit = defineEmits(["active"]);
const input_value = ref(props.item.component_props.default);

const show_error = ref(false);
const error_msg = ref('');

// 校验模块
const validEmail = () => {
  if (required && !input_value.value) {
    show_error.value = true;
    error_msg.value = '必填项不能为空';
  } else if (input_value.value && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(input_value.value)) {
    show_error.value = true;
    error_msg.value = '请输入正确邮箱';
  } else {
    show_error.value = false;
    error_msg.value = '';
  }
  return !show_error.value;
};

defineExpose({ validEmail, id: props.item.key });
</script>

<style lang="less">
.email-field-page {
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
}

// :deep(.van-field__body) {
//   border: 1px solid #eaeaea;
//   border-radius: 0.25rem;
//   padding: 0.25rem 0.5rem;
// }
</style>
