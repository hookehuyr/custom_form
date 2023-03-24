<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-01-18 15:58:11
 * @FilePath: /data-table/src/components/EmailField/index.vue
 * @Description: 邮箱输入框
-->
<template>
  <div v-if="HideShow" class="text-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-field
      v-model="item.value"
      :name="item.name"
      type="email"
      :placeholder="item.component_props.placeholder"
      :rules="rules"
      :required="item.component_props.required"
      :disabled="item.component_props.disabled"
      :readonly="item.component_props.readonly"
      clearable
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
const required = props.item.component_props.required;
const validator = (val) => {
  if (required && !val) {
    return false;
  } else if (val && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (required && !val) {
    return "必填项不能为空";
  } else if (val && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) { // 小于最小值
    return "请输入正确邮箱";
  }
};
const rules = [{ validator, message: validatorMessage }];
</script>

<style lang="less" scoped>
.text-field-page {
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
