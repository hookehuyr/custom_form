<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-08 15:28:33
 * @FilePath: /data-table/src/components/NoteField/index.vue
 * @Description: 富文本组件
-->
<template>
  <div v-if="HideShow" class="note-field-page">
    <div class="label">
      <span v-if="item.component_props.required" class="required">&nbsp;*</span>
      <span v-if="!item.component_props.hide_label">{{ item.component_props.label }}</span>
    </div>
    <div class="html" style="padding: 0.5rem 1rem 0 1rem;" v-html="item.component_props.note"></div>
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

<style lang="less">
.note-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span.required {
      color: red;
    }
  }
  .html {
    img {
      width: 100%;
    }
  }
}
</style>
