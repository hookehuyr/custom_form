<!--
 * @Date: 2022-08-31 11:45:30
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-07 16:41:40
 * @FilePath: /custom_form/src/components/TimePickerField/index.vue
 * @Description: 时间选择组件
-->
<template>
  <div v-if="HideShow" class="time-picker-field">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <nut-cell desc-text-align="left" :desc="popupDesc" @click="onTap" is-link  style="border: 1px solid #eaeaea; border-radius: 0.25rem; padding: 0.25rem 0.5rem;"></nut-cell>
    <div
      v-if="show_error"
      style="padding: 5px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
    <nut-popup position="bottom" v-model:visible="showPicker">
      <nut-date-picker
        v-model="currentTime"
        title="时间选择"
        :type="columns_type"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        :is-show-chinese="true"
      >
      </nut-date-picker>
    </nut-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const emit = defineEmits(["active"]);

const showPicker = ref(false);
const popupDesc = ref('');
const currentTime = ref('');
const readonly = props.item.component_props.readonly;

const onTap = () => {
  if (readonly) return false; // 如果为只读，不能设置
  showPicker.value = true
}

const onConfirm = ({ selectedValues, selectedOptions }) => {
  popupDesc.value = selectedOptions.map((val) => val.value).join(':');
  props.item.value = {
    key: "date",
    filed_name: props.item.key,
    value: selectedOptions.map((val) => val.value).join(':'),
  };
  emit("active", props.item.value);
  showPicker.value = false;
  validTime()
};

const columns_type = ref('time');
// const date_format = props.item.component_props.data_dateformat; // HH:mm=时分，HH:mm:ss=时分秒
onMounted(() => {
  // 根据默认值时间调整显示
  popupDesc.value = props.item.component_props.default ? props.item.component_props.default : '请选择';
  const default_time = props.item.component_props.default ? props.item.component_props.default.split(":") : [0 , 0];
  currentTime.value = new Date(2023, 1, 1, +default_time[0], +default_time[1])
});

const required = props.item.component_props.required;
const data_minvalue = props.item.component_props.data_minvalue;
const data_maxvalue = props.item.component_props.data_maxvalue;

// 错误提示
const show_error = ref(false);
const error_msg = ref('');
// 校验模块
const validTime = () => {
  // 必填项
  if (required && !popupDesc.value) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else if (required && popupDesc.value && data_minvalue && popupDesc.value < data_minvalue) {
    show_error.value = true;
    error_msg.value = "最小可选：" + data_minvalue;
  } else if (required && popupDesc.value && data_maxvalue && popupDesc.value > data_maxvalue) {
    show_error.value = true;
    error_msg.value = "最大可选：" + data_maxvalue;
  } else {
    show_error.value = false;
    error_msg.value = ''
  }
  return !show_error.value;
};

defineExpose({ validTime, id: props.item.key });
</script>

<style lang="less">
.time-picker-field {
  margin: 1rem;
  .label {
    padding-bottom: 20px;
    font-size: 26px;
    font-weight: bold;

    text {
      color: red;
    }
  }

  // :deep(.van-icon) { // 处理正式服务器上箭头上下位移问题
  //   font-size: var(--van-cell-icon-size);
  //   line-height: var(--van-cell-line-height);
  // }
}

// :deep(.van-cell--clickable) {
//   border: 1px solid #eaeaea;
//   border-radius: 0.25rem;
//   padding: 0.25rem 0.5rem;
//   margin-top: 0.5rem;
//   input {
//     color: #323233;
//   }
// }
</style>
