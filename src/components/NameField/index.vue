<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-01 11:21:00
 * @FilePath: /data-table/src/components/NameField/index.vue
 * @Description: 姓名输入框
-->
<template>
  <div v-if="HideShow" class="name-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-field
      v-model="item.value"
      :name="item.name"
      :type="item.type"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入'"
      :rules="item.rules"
      :required="item.required"
      :readonly="item.component_props.readonly"
      :disabled="item.component_props.disabled"
      :input-align="item.component_props.align"
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
onMounted(() => {
  props.item.value = props.item.component_props.default;
})
</script>

<style lang="less" scoped>
.name-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span {
      color: red;
    }
  }
}

:deep(.van-field__body) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}
</style>
