<!--
 * @Date: 2022-08-30 14:32:11
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-14 14:37:45
 * @FilePath: /data-table/src/components/AreaPickerField/index.vue
 * @Description: 省市区选择控件
-->
<template>
  <div v-if="HideShow" class="area-picker-field">
    <div class="label"><span v-if="item.component_props.required">&nbsp;*</span>{{ item.component_props.label }}</div>
    <van-field
      name="ignore"
      v-model="fieldValue"
      is-link
      readonly
      :required="item.component_props.required"
      placeholder="请选择省市区"
      :rules="item.rules"
      @click="showPicker = true"
      :border="show_address ? true : false"
    />
    <van-field
      v-if="show_address"
      name="ignore"
      v-model="address"
      placeholder="请填写详细地址"
      @blur="onBlur"
      :rules="item.rules"
      :border="false"
    />
    <!-- <div
      v-if="show_empty"
      class="van-field__error-message"
      style="padding: 0 1rem 1rem 1rem"
    >
      地址不能为空
    </div> -->
    <van-divider />

    <van-popup v-model:show="showPicker" position="bottom">
      <van-area
        v-model="item.city_code"
        title=""
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { areaList } from "@vant/area-data";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const emit = defineEmits(["active"]);
const show_empty = ref(false);

const show_address = ref(!props.item.component_props.no_street)

const address = ref("");
const city_code = ref("");
const showPicker = ref(false);
let fieldValue = ref("");

const onConfirm = ({ selectedOptions }) => {
  fieldValue.value = selectedOptions.map((option) => option.text).join(" ");
  city_code.value = selectedOptions[2]?.value;
  props.item.value = {
    key: "area_picker",
    filed_name: props.item.key,
    value: {
      address: fieldValue.value + ' ' + address.value,
      city_code: city_code.value
    },
  };
  emit("active", props.item.value);
  showPicker.value = false;
};

const onBlur = () => {
  props.item.value = {
    key: "area_picker",
    filed_name: props.item.key,
    value: {
      address: fieldValue.value + ' ' + address.value,
      city_code: city_code.value
    },
  };
  emit("active", props.item.value);
}

// 校验模块
const validAreaPicker = () => {
  // 必填项
  if (props.item.component_props.required && !fieldValue.value) {
    show_empty.value = true;
  } else if (props.item.component_props.required && !address.value) {
    show_empty.value = true;
  } else {
    show_empty.value = false;
  }
  return !show_empty.value;
};

defineExpose({ validAreaPicker });
</script>

<style lang="less" scoped>
.area-picker-field {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }
}

</style>
