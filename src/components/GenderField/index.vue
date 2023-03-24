<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-01 11:18:31
 * @FilePath: /data-table/src/components/GenderField/index.vue
 * @Description: 性别选择控件
-->
<template>
  <div v-if="HideShow" class="gender-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div v-if="item.component_props.note" class="note" v-html="item.component_props.note" />
    <van-field
      :name="item.name"
      :rules="item.rules"
      :required="item.component_props.required"
      :disabled="item.component_props.disabled"
    >
      <template #input>
        <van-radio-group v-model="item.value" direction="horizontal">
          <van-radio name="男" :checked-color="themeVars.radioColor">男</van-radio>
          <van-radio name="女" :checked-color="themeVars.radioColor">女</van-radio>
        </van-radio-group>
      </template>
    </van-field>
  </div>
</template>

<script setup>
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});

// TAG: 自定义主题颜色
const themeVars = {
  radioColor: styleColor.baseColor,
};
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

onMounted(() => {
  props.item.value = props.item.component_props.default;
})
</script>

<style lang="less" scoped>
.gender-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span {
      color: red;
    }
  }
  .note {
    font-size: 0.9rem;
    margin-left: 1rem;
    color: gray;
    padding-bottom: 0.5rem;
    white-space: pre-wrap;
  }
}
</style>
