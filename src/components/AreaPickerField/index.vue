<!--
 * @Date: 2022-08-30 14:32:11
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-07 13:36:31
 * @FilePath: /custom_form/src/components/AreaPickerField/index.vue
 * @Description: 省市区选择控件
-->
<template>
  <div v-if="HideShow" class="area-picker-field">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <nut-cell title="请选择省市区" :desc="text" is-link @click="showAddress"></nut-cell>
    <nut-textarea v-if="show_address" v-model="address_info" rows="2" :autosize="{ maxHeight: 100, minHeight: 50 }" placeholder="请填写详细地址" @blur="onBlur" :border="false" />
    <nut-divider :style="{ color: '#ebedf0' }" />
    <div
      v-if="show_error"
      style="padding-left: 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
    <nut-address v-model="address_value" v-model:visible="showPopup" :province="address.province" :city="address.city"
      :country="address.country" :town="address.town" @change="onChange" @close="close"
      custom-address-title="请选择所在地区"></nut-address>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useCascaderAreaData } from "./index";

const props = defineProps({
  item: Object,
});

const areaList = useCascaderAreaData()

// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const emit = defineEmits(["active"]);

const show_address = ref(!props.item.component_props.no_street)
const address_info = ref('')

const showPopup = ref(false);
const address = ref({
  province: [],
  city: [],
  country: [],
  town: []
})

const customValue = (address_text, address_info, address_value) => {
  let address = '';
  if (address_text === '请选择地址') {
    address = address_info
  } else {
    address = address_text + ' ' + address_info
  }
  // 发送自定义数据
  props.item.value = {
    key: "area_picker",
    filed_name: props.item.key,
    value: {
      address,
      city_code: JSON.stringify(address_value)
    },
  };
  emit("active", props.item.value);
}

onMounted(() => {
  // 初始化地址列表
  address.value['province'] = areaList;
  address.value['city'] = areaList[0]['children']
  address.value['country'] = areaList[0]['children'][0]['children'];
  customValue(text.value, address_info.value, address_value.value)
})

const text = ref('请选择地址')
const address_value = ref([])

const showAddress = () => {
  showPopup.value = !showPopup.value;
};

const onChange = (cal) => {
  if (cal.custom === 'province') { // 点击省列表时
    const id = cal.value['id']; // 当前选中省的ID
    const current_city = areaList.filter(item => item.id === id);
    address.value['city'] = current_city[0]['children']; // 更新市列表
  }
  if (cal.custom === 'city') { // 点击市列表时
    address.value['country'] = cal.value['children']; // 更新区列表
  }

  const name = address.value[cal.next]
  if (name.length < 1) {
    showPopup.value = false;
  }
};
const close = val => {
  const { province, city, country } = val.data;
  text.value = `${province.name} ${city.name} ${country.name}`;
  address_value.value = [province.id, city.id, country.id];
  // 发送自定义数据
  customValue(text.value, address_info.value, address_value.value)
};

const onBlur = () => {
  // 发送自定义数据
  customValue(text.value, address_info.value, address_value.value)
}


// 错误提示
const show_error = ref(false);
const error_msg = ref('');

const required = props.item.component_props.required;
const show_street = !props.item.component_props.no_street; // 显示详细地址
// 校验模块
const validAreaPicker = () => {
  // 必填项
  if (required && show_street && (!address_value.value.length || !address_info.value)) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else if (required && !show_street && !address_value.value.length) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else {
    show_error.value = false;
    error_msg.value = ''
  }
  return !show_error.value;
};

defineExpose({ validAreaPicker, id: props.item.key });
</script>

<style lang="less">
.area-picker-field {
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

  .nut-textarea {
    padding: 10px 32px;
  }
}
</style>
