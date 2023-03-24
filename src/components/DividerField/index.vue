<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-22 14:23:49
 * @FilePath: /data-table/src/components/DividerField/index.vue
 * @Description: 分隔线组件
-->
<template>
  <div class="divider-field-page">
    <van-divider :style="styleObj">
      {{ item.component_props.content }}
    </van-divider>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const styleObj = ref({});
onMounted(() => {
  styleObj.value = {
    color: props.item.component_props.color,
    borderColor: props.item.component_props.color,
    padding: props.item.component_props.padding,
  };
});
</script>

<style lang="less" scoped>
.divider-field-page {
}
</style>
