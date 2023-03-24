<!--
 * @Date: 2022-09-08 15:02:45
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-07 16:46:30
 * @FilePath: /data-table/src/components/DateTimePickerField/index.vue
 * @Description: 日期时间选择器
-->
<template>
  <div v-if="HideShow" class="datetime-picker">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-field
      v-model="item.value"
      is-link
      readonly
      :name="item.key"
      :required="item.component_props.required"
      :disabled="item.component_props.readonly"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请选择日期时间'"
      :rules="rules"
      @click="onTap"
      :border="false"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker-group
        title="请选择日期时间"
        :tabs="['选择日期', '选择时间']"
        @confirm="onConfirm"
        @cancel="onCancel"
      >
        <van-date-picker v-model="currentDate" :min-date="minDate" :max-date="maxDate" :columns-type="columns_date_type" />
        <van-time-picker v-model="currentTime" :columns-type="columns_time_type" />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script setup>
import { showToast } from "vant";
import dayjs from "dayjs";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const showPicker = ref(false);
const readonly = props.item.component_props.readonly;

const onTap = () => {
  if (readonly) return false; // 如果为只读，不能设置
  showPicker.value = true
}
const currentDate = ref([]);
const currentTime = ref([]);

const onConfirm = () => {
  props.item.value = `${currentDate.value.join("-")} ${currentTime.value.join(":")}`;
  showPicker.value = false;
};
const onCancel = () => {
  showPicker.value = false;
};

const columns_date_type = ref([]);
const columns_time_type = ref([]);
const date_format = props.item.component_props.data_dateformat;
// 数字前面补位
const formatZero = (num, len) => {
  if (String(num).length > len) {
    return num;
  }
  return (Array(len).join(0) + num).slice(-len)
}

const minDate = ref()
const maxDate = ref()

onMounted(() => {
  // 根据默认值时间调整显示
  const datetime = props.item.component_props.default ? props.item.component_props.default.split(" ") : props.item.value.split(" ");
  currentDate.value = datetime[0]?.split("-");
  currentTime.value = datetime[1]?.split(":");
  // YYYY=年，YYYY-MM=年月，YYYY-MM-DD=年月日，YYYY-MM-DD HH=年月日时，YYYY-MM-DD HH:mm=年月日时分，YYYY-MM-DD HH:mm:ss=年月日时分秒
  let Year = '';
  let Month = '';
  let Day = '';
  if (!props.item.component_props.default) {
    Year = String(dayjs().year());
    Month = formatZero(dayjs().month(), 2);
    Day = formatZero(dayjs().date(), 2);
  } else {
    Year = currentDate.value[0];
    Month = formatZero(currentDate.value[1], 2);
    Day = formatZero(currentDate.value[2], 2);
  }
  let Hour = ''
  let Minute = ''
  let Second = ''
  if (!props.item.component_props.default) {
    Hour = String(dayjs().hour());
    Minute = String(dayjs().minute());
    Second = String(dayjs().second());
  } else {
    Hour = currentTime.value[0];
    Minute = currentTime.value[1];
    Second = currentTime.value[2];
  }
  switch (date_format) {
    case "YYYY":
      columns_date_type.value = ['year']
      // 设置默认值
      currentDate.value = [Year];
      break;
    case "YYYY-MM":
      columns_date_type.value = ['year', 'month']
      // 设置默认值
      currentDate.value = [Year, Month];
      break;
    case "YYYY-MM-DD":
      columns_date_type.value = ['year', 'month', 'day']
      // 设置默认值
      currentDate.value = [Year, Month, Day];
      break;
    case "YYYY-MM-DD HH":
      columns_date_type.value = ['year', 'month', 'day']
      columns_time_type.value = ['hour']
      // 设置默认值
      currentDate.value = [Year, Month, Day];
      currentTime.value = [Hour];
      break;
    case "YYYY-MM-DD HH:mm":
      columns_date_type.value = ['year', 'month', 'day']
      columns_time_type.value = ['hour', 'minute']
      // 设置默认值
      currentDate.value = [Year, Month, Day];
      currentTime.value = [Hour, Minute];
      break;
    case "YYYY-MM-DD HH:mm:ss":
      columns_date_type.value = ['year', 'month', 'day']
      columns_time_type.value = ['hour', 'minute', 'second']
      // 设置默认值
      currentDate.value = [Year, Month, Day];
      currentTime.value = [Hour, Minute, Second];
      break;
  }
  // 设置默认最大最小日期
  if (data_minvalue.split(" ")[0].length) {
    const min = data_minvalue.split(" ")[0].split("-")
    minDate.value = new Date(+min[0], +min[1] - 1, +min[2])
  }
  if (data_maxvalue.split(" ")[0].length) {
    const max = data_maxvalue.split(" ")[0].split("-")
    maxDate.value = new Date(+max[0], +max[1] - 1, +max[2])
  }
});

const required = props.item.component_props.required;
const data_minvalue = props.item.component_props.data_minvalue;
const data_maxvalue = props.item.component_props.data_maxvalue;
const validator = (val) => {
  if (required && !val) {
    return false;
  } else if (val && data_minvalue && val < data_minvalue) {
    return false;
  } else if (val && data_maxvalue && val > data_maxvalue) {
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (required && !val) {
    return "必填项不能为空";
  } else if (val && data_minvalue && val < data_minvalue) {
    return "最小可选：" + data_minvalue;
  } else if (val && data_maxvalue && val > data_maxvalue) {
    return "最大可选：" + data_maxvalue;
  }
};
const rules = [{ validator, message: validatorMessage }];
</script>

<style lang="less" scoped>
.datetime-picker {
  margin: 1rem;
  .label {
    // padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }
  :deep(.van-icon) { // 处理正式服务器上箭头上下位移问题
    font-size: var(--van-cell-icon-size);
    line-height: var(--van-cell-line-height);
  }
}

:deep(.van-cell--clickable) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin-top: 0.5rem;
  input {
    color: #323233;
  }
}
</style>
