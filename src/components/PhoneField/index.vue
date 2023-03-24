<!--
 * @Date: 2022-09-02 10:46:03
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-20 07:45:28
 * @FilePath: /data-table/src/components/PhoneField/index.vue
 * @Description: 手机输入框
-->
<template>
  <div v-if="HideShow" class="phone-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <!-- <van-field
      :id="item.name"
      v-model="item.value"
      :name="item.name"
      type="digit"
      maxlength="11"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入手机号码'"
      :rules="rules"
      :required="item.component_props.required"
      :disabled="item.component_props.readonly"
      :readonly="readonly"
      @touchstart.stop="openKeyboard($event)"
      :border="false"
    > -->
    <van-field
      :id="item.name"
      v-model="item.value"
      :name="item.name"
      type="digit"
      maxlength="11"
      :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入手机号码'"
      :rules="rules"
      :required="item.component_props.required"
      :disabled="item.component_props.readonly"
      :border="false"
    >
    </van-field>
    <van-field
      v-if="is_sms"
      name="ignore"
      v-model="sms"
      center
      clearable
      label=""
      placeholder="请输入短信验证码"
      :border="false"
    >
      <template #button>
        <van-button size="small" type="primary">发送验证码</van-button>
      </template>
    </van-field>
    <van-number-keyboard
      v-model="item.value"
      :show="show"
      :maxlength="11"
      @blur="blurKeyboard()"
      safe-area-inset-bottom
    />
  </div>
</template>

<script setup>
import { wxInfo } from "@/utils/tools";
import $ from "jquery";
import { storeToRefs, mainStore } from "@/utils/generatePackage";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
// web端判断
const readonly = computed(() => wxInfo().isMobile);
// 打开短信验证模式
const is_sms = ref(false);

// 校验函数返回 true 表示校验通过，false 表示不通过
const validator = (val) => {
  if (props.item.component_props.required && !val) {
    return false;
  } else if (val && !/1\d{10}/.test(val)) {
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (props.item.component_props.required && !val) {
    return "手机号码不能为空";
  } else if (val && !/1\d{10}/.test(val)) {
    return "请输入正确手机号码";
  }
};
const rules = [{ validator, message: validatorMessage }];

const show = ref(false);
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
      show.value = false;
      document.getElementById("app").style.paddingBottom = "0";
    }
  }
);

const openKeyboard = (e) => {
  if (props.item.component_props.readonly) return false; // 如果为只读，不能设置
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
  // 选中添加border颜色
  content = $(e.target).parent();
  // TAG: 自定义主题颜色
  content.css("border-color", "#c2915f");
  setTimeout(() => {
    show.value = true;
  }, 300);
  // 记录点击field名
  store.changeFieldName(props.item.name);
};
const blurKeyboard = () => {
  show.value = false;
  document.getElementById("app").style.paddingBottom = "0";
  // 还原border颜色
  content.css("border-color", "#eaeaea");
};
</script>

<style lang="less" scoped>
.phone-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span {
      color: red;
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
}
</style>
