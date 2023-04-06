<!--
 * @Date: 2022-08-30 13:46:51
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-06 13:34:46
 * @FilePath: /custom_form/src/components/PickerField/index.vue
 * @Description: 单列选择器组件
-->
<template>
  <div v-if="HideShow" class="picker-field-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <div style="margin: 10px 20px;">
      <nut-input
        v-model="picker_value"
        is-link
        readonly
        :label="item.key"
        :required="item.component_props.required"
        :placeholder="item.component_props.placeholder"
        @click-input="onClick()"
        :border="false"
        style="padding: 0px;"
      >
        <template #right> <RectRight color="#eaeaea"></RectRight></template>
      </nut-input>
      <div
        v-if="show_error"
        style="padding: 5px; color: red; font-size: 12px;"
      >
        {{ error_msg }}
      </div>
    </div>
    <!-- <van-field v-if="has_add_info" :name="add_info_name" v-model="add_info" label="" placeholder="请输入补充信息" :border="false" style="border: 1px solid #eaeaea;border-radius: 0.25rem; padding: 0.25rem 0.5rem; margin-top: 0.25rem;" /> -->
    <nut-popup v-model:visible="showPicker" position="bottom">
      <nut-picker
        :columns="item.component_props.options"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </nut-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { RectRight } from '@nutui/icons-vue-taro';

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

const onClick = () => {
  showPicker.value = true;
}

const onConfirm = ({ selectedOptions }) => {
  picker_value.value = selectedOptions[0]?.value;
  showPicker.value = false;
  // 触发点自定义监听事件，配合规则显示隐藏其他字段
  props.item.value = {
    key: "picker",
    filed_name: props.item.key,
    value: picker_value.value,
  };
  emit("active", props.item.value);
  validPicker();
  // if (add_info_key.value === props.item.value) {
  //   has_add_info.value = true;
  // }
};
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

// 错误提示
const show_error = ref(false);
const error_msg = ref('');

// 校验模块
const validPicker = () => {
  // 必填项
  if (props.item.component_props.required && !picker_value.value) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else {
    show_error.value = false;
    error_msg.value = ''
  }
  return !show_error.value;
};

defineExpose({ validPicker, id: props.item.key });
</script>

<style lang="less">
.picker-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
    text {
      color: red;
    }

    .note-wrapper {
      font-size: 24px;
      margin-left: 30px;
      color: gray;
      padding-bottom: 15px;
      padding-top: 7px;
      white-space: pre-wrap;
    }
  }

  .nut-input {
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
  }
}

// :deep(.van-cell--clickable) {
//   border: 1px solid #eaeaea;
//   border-radius: 0.25rem;
//   padding: 0.25rem 0.5rem;
//   margin-top: 0.5rem;
// }
</style>
