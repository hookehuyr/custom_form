<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-08-29 16:44:53
 * @FilePath: /data-table/src/components/TableField/index.vue
 * @Description: 文件描述
-->
<template>
  <van-field v-if="item.component_type === 'radio'" :name="item.key" :label="item.label">
    <template #input>
      <van-radio-group v-model="item.value" direction="horizontal">
        <van-radio v-for="x in item.sub" :key="index" :name="x.key">{{ x.value }}</van-radio>
      </van-radio-group>
    </template>
  </van-field>
  <van-field v-else v-model="item.value" :name="item.name" :label="item.label" :type="item.type"
    :placeholder="item.placeholder" :rules="item.rules" :required="item.required" :autosize="item.autosize"
    :row="item.row" />
</template>

<script setup>
const props = defineProps({
  item: Object
})
</script>

<style lang="less" scoped>
</style>
