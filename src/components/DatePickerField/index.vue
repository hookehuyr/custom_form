<!--
 * @Date: 2022-08-31 11:45:30
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-10 10:07:31
 * @FilePath: /data-table/src/components/DatePickerField/index.vue
 * @Description: 日期选择组件
-->
<template>
  <div v-if="HideShow" class="date-picker-field">
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
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请选择日期'"
      :rules="rules"
      @click="onTap"
      :border="false"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="日期选择"
        :min-date="minDate"
        :max-date="maxDate"
        :columns-type="columns_type"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import dayjs from "dayjs";

const props = defineProps({
  item: Object,
});

// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const showPicker = ref(false);
const currentDate = ref([]);
const readonly = props.item.component_props.readonly;

const onTap = () => {
  if (readonly) return false; // 如果为只读，不能设置
  showPicker.value = true
}
const onConfirm = ({ selectedValues, selectedOptions }) => {
  props.item.value = selectedValues.join("-");
  showPicker.value = false;
};

const columns_type = ref([]);
const date_format = props.item.component_props.data_dateformat; // YYYY-MM=年月，YYYY-MM-DD=年月日
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
  currentDate.value = props.item.component_props.default ? props.item.component_props.default.split("-") : props.item.value.split("-");
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
  switch (date_format) {
    case "YYYY-MM":
      columns_type.value = ['year', 'month']
      // 设置默认值
      currentDate.value = [Year, Month];
      break;
    case "YYYY-MM-DD":
      columns_type.value = ['year', 'month', 'day']
      // 设置默认值
      currentDate.value = [Year, Month, Day];
      break;
  }
  // 设置默认最大最小日期
  if (data_minvalue.length) {
    const min = data_minvalue.split("-")
    minDate.value = new Date(+min[0], +min[1] - 1, +min[2])
  }
  if (data_maxvalue.length) {
    const max = data_maxvalue.split("-")
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
.date-picker-field {
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
