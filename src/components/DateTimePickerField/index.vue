<!--
 * @Date: 2022-09-08 15:02:45
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-10 14:26:15
 * @FilePath: /custom_form/src/components/DateTimePickerField/index.vue
 * @Description: 日期时间选择器
-->
<template>
  <div v-if="HideShow" class="datetime-picker">
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
        v-model="currentDate"
        title="日期时间选择"
        :type="columns_type"
        :min-date="minDate"
        :max-date="maxDate"
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

const props = defineProps({
  item: Object,
});
const emit = defineEmits(["active"]);

// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const showPicker = ref(false);
const popupDesc = ref('');
let minDate = new Date(2020, 0, 1);
let maxDate = new Date(2035, 10, 1);
const currentDate = ref('');
const readonly = props.item.component_props.readonly;

const onTap = () => {
  if (readonly) return false; // 如果为只读，不能设置
  showPicker.value = true
}

const onConfirm = ({ selectedValue, selectedOptions }) => {
  if (columns_type.value === 'datetime') {
    const date = selectedValue.slice(0, 3).join('-');
    const time = selectedValue.slice(3).join(':');
    popupDesc.value = date + ' ' + time;
    props.item.value = {
      key: "datetime",
      filed_name: props.item.key,
      value: date + ' ' + time,
    };
  } else {
    popupDesc.value = selectedOptions.map((val) => val.value).join('-');
    props.item.value = {
      key: "date",
      filed_name: props.item.key,
      value: selectedOptions.map((val) => val.value).join('-'),
    };
  }
  emit("active", props.item.value);
  showPicker.value = false;
  validDateTime()
};
const onCancel = () => {
  showPicker.value = false;
};

const columns_type = ref('datetime');
const date_format = props.item.component_props.data_dateformat;
// // 数字前面补位
// const formatZero = (num, len) => {
//   if (String(num).length > len) {
//     return num;
//   }
//   return (Array(len).join(0) + num).slice(-len)
// }

onMounted(() => {
  // 根据默认值时间调整显示
  popupDesc.value = props.item.component_props.default ? props.item.component_props.default : '请选择';
  currentDate.value = new Date(props.item.component_props.default);
  switch (date_format) {
    // case "YYYY":
    //   columns_date_type.value = ['year']
    //   // 设置默认值
    //   currentDate.value = [Year];
    //   break;
    case "YYYY-MM":
      columns_type.value = 'year-month'
      break;
    case "YYYY-MM-DD":
      columns_type.value = 'date'
      break;
    // case "YYYY-MM-DD HH":
    //   columns_date_type.value = ['year', 'month', 'day']
    //   columns_time_type.value = ['hour']
    //   // 设置默认值
    //   currentDate.value = [Year, Month, Day];
    //   currentTime.value = [Hour];
    //   break;
    // case "YYYY-MM-DD HH:mm":
    //   columns_date_type.value = ['year', 'month', 'day']
    //   columns_time_type.value = ['hour', 'minute']
    //   // 设置默认值
    //   currentDate.value = [Year, Month, Day];
    //   currentTime.value = [Hour, Minute];
    //   break;
    case "YYYY-MM-DD HH:mm:ss":
      columns_type.value = 'datetime'
      break;
  }
  // 设置默认最大最小日期
  if (data_minvalue.split(" ")[0]) {
    const min = data_minvalue.split(" ")[0].split("-")
    minDate = new Date(+min[0], +min[1] - 1, +min[2])
  }
  if (data_maxvalue.split(" ")[0]) {
    const max = data_maxvalue.split(" ")[0].split("-")
    maxDate = new Date(+max[0], +max[1] - 1, +max[2])
  }
});

const required = props.item.component_props.required;
const data_minvalue = props.item.component_props.data_minvalue;
const data_maxvalue = props.item.component_props.data_maxvalue;

// 错误提示
const show_error = ref(false);
const error_msg = ref('');
// 校验模块
const validDateTime = () => {
  // 必填项
  if (required && popupDesc.value === '请选择') {
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

defineExpose({ validDateTime, id: props.item.key });
</script>

<style lang="less">
.datetime-picker {
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
