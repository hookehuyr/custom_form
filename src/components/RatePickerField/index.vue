<!--
 * @Date: 2022-09-08 15:47:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-10 16:01:09
 * @FilePath: /custom_form/src/components/RatePickerField/index.vue
 * @Description: 评分选择控件
-->
<template>
  <div v-if="HideShow" class="rate-field">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <nut-rate
      v-model="rate_value"
      :count="item.component_props.data_length"
      :readonly="item.component_props.readonly"
      :active-color="styleColor.baseColor"
      @change="onChange"
      style="overflow: scroll; width: 100%;"
    />
    <div
      v-if="show_error"
      style="padding: 5px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
    <nut-divider  :style="{ color: '#ebedf0' }" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const emit = defineEmits(["active"]);
// 错误提示
const show_error = ref(false);
const error_msg = ref('');
const rate_value = ref(props.item.component_props.default);

const onChange = (value) => {
  props.item.value = { key: props.item.key, value, type: "rate" };
  emit("active", props.item.value);
};

onMounted(() => {
  props.item.value = { key: props.item.key, value: rate_value.value, type: "rate" };
  emit("active", props.item.value);
});

const validRate = () => {
  // 必填项
  if (props.item.component_props.required && !+rate_value.value) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else {
    show_error.value = false;
    error_msg.value = ''
  }
  return !show_error.value;
};

defineExpose({ validRate });
</script>

<style lang="less">
.rate-field {
  margin: 1rem;
  .label {
  padding-bottom: 20px;
  font-size: 26px;
  font-weight: bold;

  text {
    color: red;
  }
}
}
</style>
