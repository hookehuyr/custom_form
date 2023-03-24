<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-12-08 14:52:48
 * @FilePath: /data-table/src/components/DesField/index.vue
 * @Description: 描述文本控件
-->
<template>
  <div class="des-field-page">
    <div class="label">{{ item.component_props.label }}</div>
    <van-field
      v-model="item.component_props.desc"
      name="ignore"
      :readonly="true"
      :border="false"
    />
  </div>
  <van-divider />
</template>

<script setup>
const props = defineProps({
  item: Object,
});
</script>

<style lang="less" scoped>
.des-field-page {
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
