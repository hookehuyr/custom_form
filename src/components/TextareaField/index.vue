<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-04 15:11:32
 * @FilePath: /custom_form/src/components/TextareaField/index.vue
 * @Description: 多行文本输入框
-->
<template>
  <div v-if="HideShow" class="textarea-field-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <!-- <div
      v-if="item.component_props.note"
      v-html="item.component_props.note"
      style="font-size: 0.9rem; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre-wrap;"
    /> -->
    <nut-textarea
      v-model="input_value"
      :type="item.type"
      :border="false"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入'"
      :readonly="item.component_props.readonly"
      :max-length="item.component_props.maxlength ? item.component_props.maxlength : null"
      :limit-show="!!item.component_props.maxlength && !item.component_props.readonly"
      :autosize="{ maxHeight: 200, minHeight: 100 }"
      style="border: 1px solid #eaeaea; border-radius: 0.25rem; padding: 10px;"
    />
    <div
      v-if="show_error"
      style="padding: 5px 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";

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

onMounted(() => {
  if (props.item.component_props.default) {
    input_value.value = props.item.component_props.default;
  }
})

watch(
  () => input_value.value,
  (newValue, oldValue) => {
    props.item.value = {
      key: "textarea",
      filed_name: props.item.key,
      value: newValue,
    };
    emit("active", props.item.value);
  },
  { immediate: true }
);

// 校验模块
const validTextarea = () => {
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

defineExpose({ validTextarea, id: props.item.key });
</script>

<style lang="less">
.textarea-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
    text {
      color: red;
    }
  }
}

// :deep(.van-field__body) {
  // border: 1px solid #eaeaea;
  // border-radius: 0.25rem;
  // padding: 0.25rem 0.5rem;
// }
// :deep(.van-cell__value) {
//   border: 1px solid #eaeaea;
//   border-radius: 0.25rem;
//   padding: 0.25rem 0.5rem;
// }

input {
  color: #000 !important;
}
.nut-textarea {
  padding-left: 35px;
  padding-right: 35px;
  white-space: pre-wrap;
}
.nut-textarea__limit {
  right: 50px;
  bottom: 30px;
}
</style>
