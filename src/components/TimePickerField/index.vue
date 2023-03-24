<!--
 * @Date: 2022-08-31 11:45:30
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-10 10:11:05
 * @FilePath: /data-table/src/components/TimePickerField/index.vue
 * @Description: 时间选择组件
-->
<template>
  <div v-if="HideShow" class="time-picker-field">
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
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请选择时间'"
      :rules="rules"
      @click="onTap"
      :border="false"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-time-picker
        v-model="currentTime"
        title="请选择时间"
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
const currentTime = ref([]);
const readonly = props.item.component_props.readonly;

const onTap = () => {
  if (readonly) return false; // 如果为只读，不能设置
  showPicker.value = true
}

const onConfirm = ({ selectedValues, selectedOptions }) => {
  props.item.value = selectedValues.join(":");
  showPicker.value = false;
};

const columns_type = ref([]);
const date_format = props.item.component_props.data_dateformat; // HH:mm=时分，HH:mm:ss=时分秒
onMounted(() => {
  // 根据默认值时间调整显示
  currentTime.value = props.item.component_props.default ? props.item.component_props.default.split(":") : props.item.value.split(":");
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
    case "HH:mm":
      columns_type.value = ['hour', 'minute'];
      // 设置默认值
      currentTime.value = [Hour, Minute];
      break;
    case "HH:mm:ss":
      columns_type.value = ['hour', 'minute', 'second'];
      // 设置默认值
      currentTime.value = [Hour, Minute, Second];
      break;
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
.time-picker-field {
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
