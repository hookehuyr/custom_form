<!--
 * @Date: 2022-08-30 13:46:51
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-03 21:11:24
 * @FilePath: /data-table/src/components/PickerField/index.vue
 * @Description: 单列选择器组件
-->
<template>
  <div v-if="HideShow" class="picker-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-field
      v-model="picker_value"
      is-link
      readonly
      :name="item.key"
      :required="item.component_props.required"
      :placeholder="item.component_props.placeholder"
      :rules="item.rules"
      @click="showPicker = true"
      :border="false"
    />
    <!-- <van-field v-if="has_add_info" :name="add_info_name" v-model="add_info" label="" placeholder="请输入补充信息" :border="false" style="border: 1px solid #eaeaea;border-radius: 0.25rem; padding: 0.25rem 0.5rem; margin-top: 0.25rem;" /> -->
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="item.component_props.options"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
});
const emit = defineEmits(["active"]);

// 绑定值发生变化时回调，处理选项为其他时的输入项录入
// const has_add_info = ref(false); // TODO: 文字不一定是其他，后续可能需要字段绑定一个值,标识是否有其他输入框进行判断
// const add_info = ref('');
// const add_info_name = ref(props.item.key + '#');
// const add_info_key = ref('其他'); // TODO: 以后动态获取

onMounted(() => {
  // add_info_name.value = `${props.item.key}#${add_info_key.value}`
  // props.item.component_props.options = props.item.component_props.options.map((opt) => {
  //   return {
  //     text: opt,
  //     value: opt,
  //   };
  // });
});

const selectedValues = ref("");
const showPicker = ref(false);
const picker_value = ref(props.item.component_props.default);

const onConfirm = ({ selectedOptions }) => {
  picker_value.value = selectedOptions[0]?.value;
  showPicker.value = false;
  // 触发点自定义监听事件，配合规则显示隐藏其他字段
  props.item.value = { key: props.item.key, value: picker_value.value, type: "picker" };
  emit("active", props.item.value);
  // if (add_info_key.value === props.item.value) {
  //   has_add_info.value = true;
  // }
};
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
</script>

<style lang="less" scoped>
.picker-field-page {
  margin: 1rem;
  .label {
    // padding: 1rem 1rem 0 0;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }
}

:deep(.van-cell--clickable) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin-top: 0.5rem;
}
</style>
