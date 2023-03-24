<!--
 * @Date: 2022-09-08 15:47:54
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-01-31 22:57:40
 * @FilePath: /data-table/src/components/RatePickerField/index.vue
 * @Description: 评分选择控件
-->
<template>
  <div v-if="HideShow" class="rate-field">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-rate
      v-model="rate_value"
      :count="item.component_props.data_length"
      :readonly="item.component_props.readonly"
      :color="styleColor.baseColor"
      @change="onChange"
      style="padding: 1rem"
    />
    <div
      v-if="show_empty"
      class="van-field__error-message"
      style="padding: 0 1rem 1rem 1rem"
    >
      评分不能为空
    </div>
    <van-divider />
  </div>
</template>

<script setup>
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const emit = defineEmits(["active"]);
const show_empty = ref(false);
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
  if (props.item.component_props.required && !rate_value.value) {
    show_empty.value = true;
  } else {
    show_empty.value = false;
  }
  return !show_empty.value;
};

defineExpose({ validRate });
</script>

<style lang="less" scoped>
.rate-field {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }
}
</style>
