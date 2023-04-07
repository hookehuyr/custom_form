<!--
 * @Date: 2022-09-14 14:44:30
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-07 09:30:49
 * @FilePath: /custom_form/src/components/IdentityField/index.vue
 * @Description: 身份证输入控件
-->
<template>
  <div v-if="HideShow" class="identity-page">
  <div class="label">
    <span v-if="item.component_props.required">&nbsp;*</span>
    {{ item.component_props.label }}
  </div>
  <!-- <div v-if="item.component_props.readonly" style="padding: 0.5rem 1rem;">{{ item.value }}</div> -->
  <!-- <van-field
      ref="fieldRef"
      v-model="item.value"
      :id="item.name"
      :name="item.name"
      :placeholder="item.component_props.placeholder"
      :rules="rules"
      :required="item.component_props.required"
        :disabled="item.component_props.readonly"
        :readonly="!edit_mode"
        right-icon="edit" @click-right-icon="clickRightIcon"
        @touchstart.stop="openKeyboard($event)"
        :border="false"
      >
      </van-field> -->
    <van-field ref="fieldRef" v-model="item.value" :id="item.name" :name="item.name"
      :placeholder="item.component_props.placeholder" :rules="rules" :required="item.component_props.required"
      :disabled="item.component_props.readonly" :border="false">
    </van-field>
    <!-- <div v-if="gender" class="gender"><span>性别：</span>{{ gender }}</div> -->
    <van-number-keyboard v-model="item.value" :show="show" extra-key="X" close-button-text="完成" @blur="blurKeyboard()"
      @input="onInput" @delete="onDelete" safe-area-inset-bottom />
  </div>
</template>

<script setup>
import $ from "jquery";
import { storeToRefs, mainStore } from "@/utils/generatePackage";
import { showSuccessToast, showFailToast } from "vant";


const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
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
const readonly = props.item.component_props.readonly;
const fieldRef = ref(null);
const edit_mode = ref(false);
const clickRightIcon = () => { // 编辑模式
  edit_mode.value = true;
  nextTick(() => {
    fieldRef.value?.focus();
  })
}
const openKeyboard = (e) => {
  if (readonly || e.target.className.indexOf('edit') > 0 || edit_mode.value) return false; // 如果为只读或者编辑模式，不能设置
  // // 键盘上移动
  // const target_to_view_height = window.innerHeight - e.target.getBoundingClientRect().y; // 元素到适口高度
  // const target_top = document.body.scrollHeight - $(e.target).offset().top; // 元素到正文高度
  // let scroll_height = "";
  // console.warn(target_top);
  // if (target_top < 250) {
  //   document.getElementById("app").style.paddingBottom = "250px";
  //   window.scrollTo(0, $("#app").height());
  // } else {
  //   // 向上滚动位置
  //   document.documentElement.scrollTop = (target_top > 250 ? 0 : target_top) + 250;
  // }
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
  // 键盘失焦检查输入和添加性别显示
  const input_val = props.item.value;
  if (required && !input_val) {
    showFailToast("身份证号码不能为空");
  } else if (input_val && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(input_val)) {
    showFailToast("请输入正确身份证号码");
  } else {
    // gender.value = getGenderByIdNumber(input_val)
  }
};

// 校验函数返回 true 表示校验通过，false 表示不通过
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
const required = props.item.component_props.required;
const validator = (val) => {
  if (required && !val) {
    return false;
  } else if (val && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (required && !val) {
    return "身份证号码不能为空";
  } else if (val && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
    return "请输入正确身份证号码";
  }
};
const rules = [{ validator, message: validatorMessage }];

const onInput = (value) => { };
const onDelete = () => { };

const gender = ref('');

/**
 * 按身份证号码获取性别
 * @idNumber 身份证号码
 * @return 男：male；女：female；异常（身份证号码为空或长度、格式错误）：undefined
 */
const getGenderByIdNumber = (idNumber) => {
  if (idNumber) {
    let genderCode; // 性别代码
    if (idNumber.length == 18) { // 二代身份证号码长度为18位（第17位为性别代码）
      genderCode = idNumber.charAt(16);
    } else if (idNumber.length == 15) { // 一代身份证号码长度为15位（第15位为性别代码）
      genderCode = idNumber.charAt(14);
    }
    if (genderCode && !isNaN(genderCode)) {
      // 两代身份证号码的性别代码都为男奇女偶
      if (parseInt(genderCode) % 2 == 0) {
        return '女';
      }
      return '男';
    }
  }
}
</script>

<style lang="less" scoped>
.identity-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }

  .gender {
    padding: 0 1rem 0 1rem;
    font-size: 0.9rem;

    span {
      font-weight: bold;
    }
  }
}

:deep(.van-field__body) {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}
</style>
