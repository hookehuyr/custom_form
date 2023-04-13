<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-13 16:09:03
 * @FilePath: /custom_form/src/components/NoteField/index.vue
 * @Description: 富文本组件
-->
<template>
  <div v-if="HideShow" class="note-field-page">
    <div class="label">
      <text v-if="item.component_props.required" class="required">&nbsp;*</text>
      <text v-if="!item.component_props.hide_label">{{ item.component_props.label }}</text>
    </div>
    <div class="html" style="padding: 0 1rem; font-size: 16px;" v-html="item.component_props.note"></div>
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
</script>

<style lang="less">
.note-field-page {
  .label {
    margin-left: 1rem;
    padding-bottom: 20px;
    font-size: 26px;
    font-weight: bold;

    text.required {
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
