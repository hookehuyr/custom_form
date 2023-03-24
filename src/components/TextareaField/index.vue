<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-22 09:13:58
 * @FilePath: /data-table/src/components/TextareaField/index.vue
 * @Description: 多行文本输入框
-->
<template>
  <div v-if="HideShow" class="textarea-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div
      v-if="item.component_props.note"
      v-html="item.component_props.note"
      style="font-size: 0.9rem; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre-wrap;"
    />
    <van-field
      v-model="item.value"
      :name="item.name"
      :type="item.type"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入'"
      :rules="item.rules"
      :required="item.component_props.required"
      :readonly="item.component_props.readonly"
      :rows="item.component_props.rows"
      autosize
      :maxlength="item.component_props.maxlength ? item.component_props.maxlength : null"
      :show-word-limit="item.component_props.maxlength"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
</script>

<style lang="less" scoped>
.textarea-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span {
      color: red;
    }
  }
}

// :deep(.van-field__body) {
  // border: 1px solid #eaeaea;
  // border-radius: 0.25rem;
  // padding: 0.25rem 0.5rem;
// }
:deep(.van-cell__value) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}
</style>
