<!--
 * @Date: 2022-09-14 14:44:30
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-06 15:51:54
 * @FilePath: /custom_form/src/components/NumberField/index.vue
 * @Description: 数字输入框
-->
<template>
  <div v-if="HideShow" class="number-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <div
      v-if="item.component_props.note"
      v-html="item.component_props.note"
      style="font-size: 0.9rem; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre-wrap;"
    />
    <nut-input
      ref="inputRef"
      v-model="input_value"
      :id="item.name + '_input'"
      :label="item.name"
      :placeholder="item.component_props.placeholder"
      :disabled="item.component_props.readonly"
      readonly
      @click-input="showKeyboard($event)"
      :border="false"
      style="border: 1px solid #eaeaea; border-radius: 0.25rem; padding: 0.25rem 0.5rem;"
    >
    </nut-input>
    <div
      v-if="show_error"
      style="padding-left: 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
    <nut-number-keyboard
      v-model="input_value"
      v-model:visible="showInteger"
      :overlay="true"
      @close="blurKeyboard"
      @input="onInput"
      @delete="onDelete"
    />
    <nut-number-keyboard
      v-model="input_value"
      v-model:visible="showDecimal"
      type="rightColumn"
      :custom-key="customKey"
      close-button-text="完成"
      @close="blurKeyboard"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import Taro, { useLoad } from '@tarojs/taro'
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { $ } from '@tarojs/extend';
import { storeToRefs } from "pinia";
import { mainStore } from '@/stores'

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
let content = "";
const customKey = ref(['.']);
const input_value = ref('');
const inputRef = ref(null)

const store = mainStore();
const { fieldName } = storeToRefs(store);
const emit = defineEmits(["active"]);

// 监听字段变化
watch(
  () => fieldName.value,
  (v) => {
    // 如果不是点击本输入框
    if (v !== props.item.name) {
      // 还原border颜色
      $(`#${props.item.name}`).parent().css("border-color", "#eaeaea");
      if (props.item.component_props.max_fraction_count > 0) {
        // 显示小数键盘
        showDecimal.value = false;
      } else {
        // 显示整数键盘
        showInteger.value = false;
      }
      if (process.env.TARO_ENV === 'h5') {
        $('#app').css('padding-bottom', '0')
      } else {
        $('.table-page').css('padding-bottom', '0')
      }
    }
  }
);
const readonly = props.item.component_props.readonly;
const showKeyboard = (e) => {
  if (readonly) return false; // 如果为只读，不能设置
  // 键盘上移动
  const windowHeight = Taro.getSystemInfoSync().windowHeight; // 可使用窗口高度
  Taro.createSelectorQuery().select(`#${props.item.name}`).boundingClientRect(async (res) => {
    const target_to_view_height = windowHeight - res.bottom; // 元素到视口高度
    // const target_top = document.body.scrollHeight - $(e.target).offset().top; // 元素到正文高度
    // let scroll_height = "";
    if (target_to_view_height <= 250) {
      if (process.env.TARO_ENV === 'h5') {
        $('#app').css('padding-bottom', '250px')
      } else {
        $('.table-page').css('padding-bottom', '250px')
      }
      // 向上滚动位置
      setTimeout(() => {
        Taro.pageScrollTo({
          scrollTop: res.top,
          duration: 300
        })
      }, 500);
    }
  }).exec()

  // if (target_top < 250) {
  //   window.scrollTo(0, $("#app").height());
  // } else {
  //   // 向上滚动位置
  //   document.documentElement.scrollTop = (target_top > 500 ? 0 : target_top) + 250;
  // }
  // 选中添加border颜色
  content = $(`#${props.item.name}_input`);
  // TAG: 自定义主题颜色
  content.css("border-color", "#c2915f");
  setTimeout(() => {
    if (props.item.component_props.max_fraction_count > 0) {
      // 显示小数键盘
      showDecimal.value = true;
    } else {
      // 显示整数键盘
      showInteger.value = true;
    }
  }, 300);
  // 记录点击field名
  store.changeFieldName(props.item.name);
};
const blurKeyboard = () => {
  if (props.item.component_props.max_fraction_count > 0) {
    // 显示小数键盘
    showDecimal.value = false;
  } else {
    // 显示整数键盘
    showInteger.value = false;
  }
  if (process.env.TARO_ENV === 'h5') {
    $('#app').css('padding-bottom', '0')
  } else {
    $('.table-page').css('padding-bottom', '0')
  }
  // 还原border颜色
  content.css("border-color", "#eaeaea");
  // 发送自定义回调数字
  props.item.value = {
    key: "number",
    filed_name: props.item.key,
    value: input_value.value,
  };
  emit("active", props.item.value);
  validNumber()
};

const showDecimal = ref(false);
const showInteger = ref(false);

// 校验函数返回 true 表示校验通过，false 表示不通过
const required = props.item.component_props.required;
const min = props.item.component_props.min;
const max = props.item.component_props.max;
const max_count = props.item.component_props.max_fraction_count; // 保留小数个数 null=不限，0=没有小数，大于0=最多只能输入的小数个数
const reg = new RegExp("^([0-9]+)(\\.(\\d){" + max_count +"," + max_count +"})$", "g");

const show_error = ref(false);
const error_msg = ref('');
// 校验模块
const validNumber = () => {
  // 必填项
  if (required && !input_value.value) { // 必填
    show_error.value = true;
    error_msg.value = '必填项不能为空';
  } else if (input_value.value && min && (input_value.value < min)) { // 小于最小值
    show_error.value = true;
    error_msg.value = `最小值为 ${min}`;
  } else if (input_value.value && max && (input_value.value > max)) { // 大于最大值
    show_error.value = true;
    error_msg.value = `最大值为 ${max}`;
  } else if (input_value.value && max_count && !reg.test(input_value.value)) { // 不符合保留小数个数
    show_error.value = true;
    error_msg.value = `保留小数点后 ${max_count} 位`;
  } else {
    show_error.value = false;
    error_msg.value = '';
  }
  return !show_error.value;
};

defineExpose({ validNumber, id: props.item.key });

const onInput = (value) => {
};
const onDelete = () => {};
</script>

<style lang="less">
.number-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
    text {
      color: red;
    }
  }

  .nut-input {
    padding: 20px 25px;
  }
}

// :deep(.van-field__body) {
//   border: 1px solid #eaeaea;
//   border-radius: 0.25rem;
//   padding: 0.25rem 0.5rem;
//   input {
//     color: #323233;
//   }
// }

// :deep(.van-number-keyboard__title) {
//   font-size: 1.05rem;
// }
</style>
