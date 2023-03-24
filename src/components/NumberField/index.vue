<!--
 * @Date: 2022-09-14 14:44:30
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-09 15:54:02
 * @FilePath: /data-table/src/components/NumberField/index.vue
 * @Description: 数字输入框
-->
<template>
  <div v-if="HideShow" class="number-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div
      v-if="item.component_props.note"
      v-html="item.component_props.note"
      style="font-size: 0.9rem; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre-wrap;"
    />
    <van-field
      v-model="item.value"
      :id="item.name"
      :name="item.name"
      :placeholder="item.component_props.placeholder"
      :rules="rules"
      :required="item.component_props.required"
      :disabled="item.component_props.readonly"
      readonly
      @touchstart.stop="showKeyboard($event)"
      :border="false"
    >
    </van-field>
    <van-number-keyboard
      v-model="item.value"
      :show="showInteger"
      @blur="blurKeyboard()"
      @input="onInput"
      @delete="onDelete"
      safe-area-inset-bottom
    />
    <van-number-keyboard
      v-model="item.value"
      :show="showDecimal"
      theme="custom"
      extra-key="."
      close-button-text="完成"
      @blur="blurKeyboard()"
      @input="onInput"
      @delete="onDelete"
      safe-area-inset-bottom
    />
  </div>
</template>

<script setup>
import $ from "jquery";
import { storeToRefs, mainStore } from "@/utils/generatePackage";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
let content = "";

const store = mainStore();
const { fieldName } = storeToRefs(store);

// 监听字段变化
watch(
  () => fieldName.value,
  (v) => {
    // 如果不是点击本输入框
    if (v !== props.item.name) {
      // 还原border颜色
      $(`#${props.item.name}`).parent().css("border-color", "#eaeaea");
      if (props.item.component_props.max_fraction_count === 0) {
        // 显示整数键盘
        showInteger.value = false;
      } else {
        // 显示小数键盘
        showDecimal.value = false;
      }
      document.getElementById("app").style.paddingBottom = "0";
    }
  }
);
const readonly = props.item.component_props.readonly;
const showKeyboard = (e) => {
  if (readonly) return false; // 如果为只读，不能设置
  // 键盘上移动
  const target_to_view_height =
    window.innerHeight - e.target.getBoundingClientRect().bottom; // 元素到适口高度
  const target_top = document.body.scrollHeight - $(e.target).offset().top; // 元素到正文高度
  let scroll_height = "";
  if (target_to_view_height <= 250) {
    document.getElementById("app").style.paddingBottom = "250px";
    // 向上滚动位置
    document.documentElement.scrollTop = $(e.target).offset().top - 244;
  }
  // if (target_top < 250) {
  //   window.scrollTo(0, $("#app").height());
  // } else {
  //   // 向上滚动位置
  //   document.documentElement.scrollTop = (target_top > 500 ? 0 : target_top) + 250;
  // }
  // 选中添加border颜色
  content = $(e.target).parent();
  // TAG: 自定义主题颜色
  content.css("border-color", "#c2915f");
  setTimeout(() => {
    if (props.item.component_props.max_fraction_count === 0) {
      // 显示整数键盘
      showInteger.value = true;
    } else {
      // 显示小数键盘
      showDecimal.value = true;
    }
  }, 300);
  // 记录点击field名
  store.changeFieldName(props.item.name);
};
const blurKeyboard = () => {
  if (props.item.component_props.max_fraction_count === 0) {
    // 显示整数键盘
    showInteger.value = false;
  } else {
    // 显示小数键盘
    showDecimal.value = false;
  }
  document.getElementById("app").style.paddingBottom = "0";
  // 还原border颜色
  content.css("border-color", "#eaeaea");
};

const showDecimal = ref(false);
const showInteger = ref(false);

// 校验函数返回 true 表示校验通过，false 表示不通过
const required = props.item.component_props.required;
const min = props.item.component_props.min;
const max = props.item.component_props.max;
const max_count = props.item.component_props.max_fraction_count; // 保留小数个数 null=不限，0=没有小数，大于0=最多只能输入的小数个数
const reg = new RegExp("^([0-9]+)(\\.(\\d){" + max_count +"," + max_count +"})$", "g");
const validator = (val) => {
  if (required && !val) { // 必填
    return false;
  } else if (val && min && (val < min)) { // 小于最小值
    return false;
  } else if (val && max && (val > max)) { // 大于最大值
    return false;
  } else if (val && max_count && !reg.test(val)) { // 不符合保留小数个数
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (required && !val) {
    return "必填项不能为空";
  } else if (val && min && (val < min)) { // 小于最小值
    return "最小值为" + min;
  } else if (val && max && (val > max)) { // 大于最大值
    return "最大值为" + max;
  } else if (val && max_count && !reg.test(val)) { // 不符合保留小数个数
    return "保留小数点后" + max_count + "位";
  }
};
const rules = [{ validator, message: validatorMessage }];

const onInput = (value) => {};
const onDelete = () => {};
</script>

<style lang="less" scoped>
.number-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span {
      color: red;
    }
  }
}

:deep(.van-field__body) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  input {
    color: #323233;
  }
}

:deep(.van-number-keyboard__title) {
  font-size: 1.05rem;
}
</style>
