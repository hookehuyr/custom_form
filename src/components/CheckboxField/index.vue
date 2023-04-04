<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-04 11:03:21
 * @FilePath: /custom_form/src/components/CheckboxField/index.vue
 * @Description: 多项选择控件
-->
<template>
  <div v-if="HideShow" class="checkbox-field-page">
    <div class="label">
      <text v-if="item.component_props.required" style="color: red">&nbsp;*</text>
      {{ item.component_props.label }}
      <text v-if="item.component_props.max" style="color: gray">
        (最多可选数:&nbsp;{{ item.component_props.max }})
      </text>
    </div>
    <div v-if="item.component_props.note" class="note" v-html="item.component_props.note" />
    <nut-checkbox-group v-model="checkbox_value" :direction="item.component_props.direction"
      :max="item.component_props.max" style="width: 100%">
      <div v-for="x in item.component_props.options" :key="x.title" class="checkbox-wrapper">
        <nut-checkbox @click="onClick(x)" :label="x.title" icon-size="16" style="margin-bottom: 0.25rem">{{ x.title }}</nut-checkbox>
        <nut-input
          v-if="checkbox_value.includes(x.value) && x.is_input"
          @blur="onBlur(x)"
          v-model="x.affix"
          label=" " label-width="5px" :placeholder="x.input_placeholder" :border="false"
          :required="x.input_required" class="affix-input" />
        <div
          v-if="x.show_error"
          style="padding: 5px 20px; color: red; font-size: 12px;"
        >
          {{ x.error_msg }}
        </div>
      </div>
    </nut-checkbox-group>
    <div
      v-if="show_error"
      style="padding: 5px 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});
// TAG: 自定义主题颜色
const themeVars = {
  radioColor: styleColor.baseColor,
};
onMounted(() => {
  // 默认值为数组
  props.item.value = props.item.component_props.default;
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const emit = defineEmits(["active"]);
const checkbox_value = ref(props.item.component_props.default);
const affix_value = ref({});
const options = props.item.component_props.options;

const clearAffix = () => {
  // 为选中项目的补充清空
  options.forEach(element => {
    if (!checkbox_value.value.includes(element.value)) {
      element.affix = ''
    }
    element.show_error = false;
    element.error_msg = '';
  });
}

const onClick = (item) => {
  item.checked = !item.checked;
  handleEmit(item);
  // 清空错误提示
  clearAffix();
  // 校验输入项数据
  validCheckbox();
}
const onBlur = (item) => {
  handleEmit(item)
}
const handleEmit = (item) => {
  // 选中状态添加属性
  if (item.checked) {
    affix_value.value[item.value] = item.affix ? `${item.title}: ${item.affix}` : '';
  } else {
    // 为选中删除属性
    delete affix_value.value[item.value]
  }
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: checkbox_value.value, affix: affix_value.value, type: "checkbox" };
  emit("active", props.item.value);
}

onMounted(() => {
  // 新增错误提示标识
  options.forEach(element => {
    element.show_error = false;
    element.error_msg = '';
  });
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: checkbox_value.value, affix: affix_value.value, type: "checkbox" };
  emit("active", props.item.value);
});

const show_error = ref(false);
const error_msg = ref('');
// 校验模块
const validCheckbox = () => {
  // 必填项
  props.item.component_props.options.some(item => {
    // 必选项勾选校验
    if (!checkbox_value.value.length && item.input_required) {
      show_error.value = true;
      error_msg.value = '必填项不能为空';
      return true;
    }
    // 必选项勾选，校验补充信息填写情况校验
    else if (checkbox_value.value.includes(item.value) && item.is_input && item.input_required && !item.affix) {
      show_error.value = true;
      error_msg.value = '';
      item.show_error = true;
      item.error_msg = '补充信息不能为空';
      return true;
    } else {
      show_error.value = false;
      error_msg.value = '';
      item.show_error = false;
      item.error_msg = '';
    }
  });
  return !show_error.value;
};

defineExpose({ validCheckbox });
</script>

<style lang="less">
.checkbox-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
  }

  .note {
    font-size: 30px;
    margin-left: 1rem;
    color: gray;
    padding-bottom: 0;
    white-space: pre-wrap;
  }

  .checkbox-wrapper {
    border: 1px solid #eaeaea;
    border-radius: 0.25rem;
    padding: 25px;
    margin: 25px;
  }
  .affix-input {
    border: 1px solid #eaeaea;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
}

:deep(.van-checkbox) {
  // border: 1px solid #eaeaea;
  // border-radius: 0.25rem;
  // padding: 0.25rem 0.5rem;
}
</style>
